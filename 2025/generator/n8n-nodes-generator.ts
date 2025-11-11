// gen-single-file.ts
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import _ from 'lodash';
import { execSync } from 'child_process'

try {
  await fs.access(".env")
} catch (error) {
  const envText = `
  NAMESPACE=
  OPENAPI_URL=
  `
  // generate .env
  await fs.writeFile(".env", envText)
  console.log('[GEN] Generated .env');
}

const NAMESPACE = process.env.NAMESPACE
const OPENAPI_URL = process.env.OPENAPI_URL

if (!NAMESPACE || !OPENAPI_URL) {
  throw new Error('NAMESPACE and OPENAPI_URL are required')
}

const namespaceCase = _.startCase(_.camelCase(NAMESPACE)).replace(/ /g, '');
const OUT_DIR = path.join('src', 'nodes');
const OUT_FILE = path.join(OUT_DIR, `${namespaceCase}.node.ts`);
const CREDENTIAL_NAME = 'wibuApi';

interface OpenAPI {
  paths: Record<string, any>;
  components?: any;
  tags?: { name: string }[];
}

// helpers
const safe = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '_');

// load OpenAPI
async function loadOpenAPI(): Promise<OpenAPI> {
  const url = OPENAPI_URL!
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch OpenAPI: ${res.status} ${res.statusText}`);
  return res.json() as Promise<OpenAPI>;
}

// convert operation to value
function operationValue(tag: string, operationId: string) {
  return `${safe(tag)}_${safe(operationId)}`;
}

// build properties for dropdown + dynamic inputs
function buildPropertiesBlock(ops: Array<any>) {
  const options = ops.map((op) => {
    const value = operationValue(op.tag, op.operationId);
    const label = `${NAMESPACE} ${op.tag} ${op.operationId}`;
    return `{ name: '${label}', value: '${value}', description: ${JSON.stringify(
      op.summary || op.description || '',
    )}, action: '${label}' }`;
  });

  const dropdown = `
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      options: [
        ${options.join(',\n        ')}
      ],
      default: '${operationValue(ops[0].tag, ops[0].operationId)}',
      description: 'Pilih endpoint yang akan dipanggil'
    }
  `;

  const dynamicProps: string[] = [];

  for (const op of ops) {
    const value = operationValue(op.tag, op.operationId);

    // Query fields
    for (const name of op.query ?? []) {
      dynamicProps.push(`
      {
        displayName: 'Query ${name}',
        name: 'query_${name}',
        type: 'string',
        default: '',
        placeholder: '${name}',
        description: '${name}',
        displayOptions: { show: { operation: ['${value}'] } }
      }`);
    }

    // Body fields (required only)
    const bodyRequired = op.body?.required ?? [];
    const bodySchema = op.body?.schema ?? {};

    for (const name of bodyRequired) {
      const schema = bodySchema[name] ?? {};
      let type = 'string';
      if (schema.type === 'number' || schema.type === 'integer') type = 'number';
      if (schema.type === 'boolean') type = 'boolean';

      const defVal =
        type === 'string' ? "''" : type === 'number' ? '0' : type === 'boolean' ? 'false' : "''";

      dynamicProps.push(`
      {
        displayName: 'Body ${name}',
        name: 'body_${name}',
        type: '${type}',
        default: ${defVal},
        placeholder: '${name}',
        description: '${schema?.description ?? name}',
        displayOptions: { show: { operation: ['${value}'] } }
      }`);
    }
  }

  return `[
    ${dropdown},
    ${dynamicProps.join(',\n    ')}
  ]`;
}

// build execute switch
function buildExecuteSwitch(ops: Array<any>) {
  const cases: string[] = [];

  for (const op of ops) {
    const val = operationValue(op.tag, op.operationId);
    const method = (op.method || 'get').toLowerCase();
    const url = op.path;
    const q = op.query ?? [];
    const bodyReq = op.body?.required ?? [];

    const qLines =
      q
        .map(
          (name: string) =>
            `const query_${_.snakeCase(name)} = this.getNodeParameter('query_${_.snakeCase(name)}', i, '') as string;`,
        )
        .join('\n          ') || '';

    const bodyLines =
      bodyReq
        .map(
          (name: string) =>
            `const body_${_.snakeCase(name)} = this.getNodeParameter('body_${_.snakeCase(name)}', i, '') as any;`,
        )
        .join('\n          ') || '';

    const bodyObject =
      bodyReq.length > 0
        ? `const body = { ${bodyReq.map((n: string) => `${_.snakeCase(n)}: body_${_.snakeCase(n)}`).join(', ')} };`
        : 'const body = undefined;';

    const paramsObj =
      q.length > 0 ? `params: { ${q.map((n: string) => `${_.snakeCase(n)}: query_${_.snakeCase(n)}`).join(', ')} },` : '';

    const dataLine = method === 'get' ? '' : 'data: body,';

    cases.push(`
      case '${val}': {
          ${qLines}
          ${bodyLines}
          ${bodyObject}
          url = baseUrl + '${url}';
          method = '${method}';
          axiosConfig = {
            headers: finalHeaders,
            ${paramsObj}
            ${dataLine}
          };
          break;
      }
    `);
  }

  return `
    switch (operation) {
      ${cases.join('\n')}
      default:
        throw new Error('Unknown operation: ' + operation);
    }
  `;
}

// top-level
function generateNodeFile(ops: Array<any>) {
  const propertiesBlock = buildPropertiesBlock(ops);
  const executeSwitch = buildExecuteSwitch(ops);

  return `import type { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';
import axios from 'axios';

export class ${namespaceCase} implements INodeType {
  description: INodeTypeDescription = {
    displayName: '${namespaceCase}',
    name: '${namespaceCase}',
    icon: 'file:icon.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Universal node generated from OpenAPI - satu node memuat semua endpoint',
    defaults: { name: '${namespaceCase}' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      { name: '${CREDENTIAL_NAME}', required: true }
    ],
    properties: ${propertiesBlock}
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: any[] = [];
    const creds = await this.getCredentials('${CREDENTIAL_NAME}') as any;

    const baseUrlRaw = creds?.baseUrl ?? '';
    const apiKeyRaw = creds?.token ?? '';
    const baseUrl = String(baseUrlRaw || '').replace(/\\/$/, '');
    const apiKey = String(apiKeyRaw || '').trim().replace(/^Bearer\\s+/i, '');

    if (!baseUrl) throw new Error('Base URL tidak ditemukan');
    if (!apiKey) throw new Error('Token tidak ditemukan');

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      let url = '';
      let method: any = 'get';
      let axiosConfig: any = {};
      const finalHeaders: any = { Authorization: \`Bearer \${apiKey}\` };

      ${executeSwitch}

      try {
        const response = await axios({ method, url, ...axiosConfig });
        returnData.push(response.data);
      } catch (err: any) {
        returnData.push({
          error: true,
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}

`;
}

// main
async function run() {


  try {
    await fs.access("package.json")
  } catch (e) {
    // generate main package
    await fs.writeFile("package.json", mainPackageJson())
    console.log('[GEN] Generated main package.json');
  }

  try {
    await fs.access(OUT_DIR)
  } catch (e) {
    // create nodes dir
    await fs.mkdir(OUT_DIR, { recursive: true }).catch(() => { })
    console.log('[GEN] Created nodes dir');
  }

  try {
    await fs.access("src/credentials")
  } catch (e) {
    // create credentials dir
    await fs.mkdir("src/credentials", { recursive: true }).catch(() => { })
    console.log('[GEN] Created credentials dir');
  }

  try {
    await fs.access(`${OUT_DIR}/icon.svg`)
  } catch (e) {
    // generate svg icon 
    await fs.writeFile(`${OUT_DIR}/icon.svg`, iconTemplate(NAMESPACE!.substring(0, 2)))
    console.log('[GEN] Generated icon.svg');
  }

  try {
    await fs.access("src/credentials/WibuApi.credentials.ts")
  } catch (e) {
    // generate credentials
    await fs.writeFile("src/credentials/WibuApi.credentials.ts", credentials())
    console.log('[GEN] Generated credentials');
  }

  try {
    await fs.access("package.txt")
  } catch (error) {
    // generate package.txt
    await fs.writeFile("package.txt", packageJsonText(NAMESPACE!))
    console.log('[GEN] Generated package.txt');
  }

  try {
    await fs.access("node_modules")
  } catch (e) {
    console.log('[GEN] Installing dependencies...');
    // install dependencies
    execSync("bun install")
  }

  try {
    await fs.access(".gitignore")
  } catch (e) {
    // build
    execSync("npx -y gitignore node")
    console.log('[GEN] gitignored');
  }

  try {
    await fs.access("tsconfig.json")
  } catch (e) {
    // generate tsconfig.json
    await fs.writeFile("tsconfig.json", tsConfig())
    console.log('[GEN] Generated tsconfig.json');
  }

  console.log('💡 Loading OpenAPI...');
  const api = await loadOpenAPI();

  const ops: Array<any> = [];

  for (const pathStr of Object.keys(api.paths || {})) {
    const pathObj = api.paths[pathStr];

    for (const method of Object.keys(pathObj)) {
      const operation = pathObj[method];
      const tags = operation.tags?.length ? operation.tags : ['default'];

      console.log("✅", _.upperCase(method).padEnd(7), pathStr);

      const operationId = operation.operationId || `${method}_${safe(pathStr)}`;
      const query = (operation.parameters ?? [])
        .filter((p: any) => p.in === 'query')
        .map((p: any) => p.name);

      const requestBody =
        operation.requestBody?.content?.['application/json']?.schema ??
        operation.requestBody?.content?.['multipart/form-data']?.schema ??
        null;

      const bodyRequired = requestBody?.required ?? [];
      const bodyProps = requestBody?.properties ?? {};

      for (const tag of tags) {
        ops.push({
          tag,
          path: pathStr,
          method,
          operationId,
          summary: operation.summary || '',
          description: operation.description || '',
          query,
          body: {
            required: bodyRequired,
            schema: bodyProps,
          },
        });
      }
    }
  }

  if (ops.length === 0) throw new Error('No operations found');

  const raw = generateNodeFile(ops);

  // ✅ PRETTIER SAFE-FORMAT
  let formatted: string;
  try {
    console.log('💡 Formatting with Prettier...');
    const conf = await prettier.resolveConfig(process.cwd()).catch(() => null);

    formatted = await prettier.format(raw, {
      ...(conf || {}),
      parser: 'typescript',
    });
  } catch (err) {
    console.warn('⚠️ Prettier gagal → output raw digunakan.');
    formatted = raw;
  }

  console.log('✅ Generated single node file:', OUT_FILE);
  await fs.writeFile(OUT_FILE, formatted, 'utf-8');

  console.log('💡 Compiling TypeScript...');
  execSync('rm -rf dist')

  console.log('💡 Compiling TypeScript...');
  execSync('npx -y tsc')

  const packageText = await fs.readFile("package.txt", 'utf-8')
  const packageJson = JSON.parse(packageText)

  const version = packageJson.version.split(".")
  version[2] = (Number(version[2]) + 1).toString()
  packageJson.version = version.join(".")
  console.log("💡 version", packageJson.version)

  packageJson.name = `n8n-nodes-${_.kebabCase(namespaceCase)}`
  packageJson.n8n.nodes = [`nodes/${namespaceCase}.node.js`]
  packageJson.n8n.credentials = [`credentials/WibuApi.credentials.js`]

  console.log('💡 Updating package.json...')
  await fs.writeFile("dist/package.json", JSON.stringify(packageJson, null, 2))
  await fs.writeFile("package.txt", JSON.stringify(packageJson, null, 2))
  await fs.copyFile(`${OUT_DIR}/icon.svg`, "dist/nodes/icon.svg")

  console.log('💡 Renaming dist to package name...')
  await fs.rename("dist", packageJson.name).catch((e) => { throw new Error("gagal rename dist") })

  console.log('💡 Publishing...')
  // execSync(`cd ${packageJson.name} && bun publish`)

  console.log('✅ Generated single node file:', OUT_FILE);
}

run().catch((err) => {
  console.error('❌ Generator failed:', err);
  process.exit(1);
});


function iconTemplate(text: string) {
  const templateText = `
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" aria-label="Icon AB square">
  <defs>
    <style>
      .bg { fill: #111827; rx: 20; }
      .letters { fill: #f9fafb; font-family: "Inter", "Segoe UI", Roboto, sans-serif; font-weight: 800; font-size: 56px; }
    </style>
  </defs>

  <!-- rounded square background -->
  <rect class="bg" width="128" height="128" rx="20" ry="20"/>

  <!-- letters -->
  <text class="letters" x="64" y="78" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>

  `

  return templateText
}


function credentials() {
  const text = `
  import { ICredentialType, INodeProperties } from "n8n-workflow";

export class WibuApi implements ICredentialType {
    name = "wibuApi";
    displayName = "Wibu API (Bearer Token)";

    properties: INodeProperties[] = [
        {
            displayName: "Base URL",
            name: "baseUrl",
            type: "string",
            default: "",
            placeholder: "https://api.example.com",
            description: "Masukkan URL dasar API tanpa garis miring di akhir",
            required: true,
        },
        {
            displayName: "Bearer Token",
            name: "token",
            type: "string",
            default: "",
            typeOptions: { password: true },
            description: "Masukkan token autentikasi Bearer (tanpa 'Bearer ' di depannya)",
            required: true,
        },
    ];
}

  `

  return text
}

function packageJsonText(namespaceCase: string) {
  const text = `
  {
  "name": "n8n-nodes-${namespaceCase}",
  "version": "1.0.43",
  "keywords": [
    "n8n",
    "n8n-nodes"
  ],
  "author": {
    "name": "makuro",
    "phone": "6289697338821"
  },
  "license": "ISC",
  "description": "",
  "n8n": {
    "nodes": [
      "nodes/${namespaceCase}.node.js"
    ],
    "n8nNodesApiVersion": 1,
    "credentials": [
      "credentials/WibuApi.credentials.js"
    ]
  }
}`

  return text
}

function mainPackageJson() {
  const text = `
  {
  "name": "n8n-generator",
  "type": "module",
  "private": true,
  "scripts": {
    "gen": "bun gen.ts"
  },
  "dependencies": {
    "express": "^5.1.0",
    "lodash": "^4.17.21",
    "n8n-core": "^1.117.1",
    "n8n-workflow": "^1.116.0",
    "nock": "^14.0.10",
    "ssh2": "^1.17.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/lodash": "^4.17.20",
    "@types/express": "^5.0.5",
    "@types/node": "^24.10.0",
    "@types/ssh2": "^1.15.5",
    "prettier": "^3.6.2",
    "ts-node": "^10.9.2"
  },
  "peerDependencies": {
    "typescript": "^5"
  }
}`

  return text
}


function tsConfig(){
  const text = `
  {
  "compilerOptions": {
    "lib": ["es2021", "dom"],
    "module": "commonjs",
    "target": "es2017",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts", "src/nodes/**/*.svg"]
}


  `

  return text
}
