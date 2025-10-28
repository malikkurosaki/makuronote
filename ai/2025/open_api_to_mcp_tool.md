# OPEN API TO MCP TOOL

```ts
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

interface McpTool {
    name: string;
    description: string;
    inputSchema: any;
    "x-props": {
        method: string;
        path: string;
        operationId?: string;
        tag?: string;
        deprecated?: boolean;
        summary?: string;
    };
}

/**
 * Convert OpenAPI 3.x JSON spec into MCP-compatible tool definitions (without run()).
 * Hanya menyertakan endpoint yang memiliki tag berisi "mcp".
 */
export function convertOpenApiToMcpTools(openApiJson: any): McpTool[] {
    const tools: McpTool[] = [];
    const paths = openApiJson.paths || {};

    for (const [path, methods] of Object.entries(paths)) {
        // ✅ skip semua path internal MCP
        if (path.startsWith("/mcp")) continue;

        for (const [method, operation] of Object.entries<any>(methods as any)) {
            const tags: string[] = Array.isArray(operation.tags) ? operation.tags : [];

            // ✅ exclude semua yang tidak punya tag atau tag-nya tidak mengandung "mcp"
            if (!tags.length || !tags.some(t => t.toLowerCase().includes("mcp"))) continue;

            const rawName = _.snakeCase(operation.operationId || `${method}_${path}`) || "unnamed_tool";
            const name = cleanToolName(rawName);

            const description =
                operation.description ||
                operation.summary ||
                `Execute ${method.toUpperCase()} ${path}`;

            const schema =
                operation.requestBody?.content?.["application/json"]?.schema || {
                    type: "object",
                    properties: {},
                    additionalProperties: true,
                };

            const tool: McpTool = {
                name,
                description,
                "x-props": {
                    method: method.toUpperCase(),
                    path,
                    operationId: operation.operationId,
                    tag: tags[0],
                    deprecated: operation.deprecated || false,
                    summary: operation.summary,
                },
                inputSchema: {
                    ...schema,
                    additionalProperties: true,
                    $schema: "http://json-schema.org/draft-07/schema#",
                },
            };

            tools.push(tool);
        }
    }

    return tools;
}

/**
 * Bersihkan nama agar valid untuk digunakan sebagai tool name
 * - hapus karakter spesial
 * - ubah slash jadi underscore
 * - hilangkan prefix umum (get_, post_, api_, dll)
 * - rapikan underscore berganda
 */
function cleanToolName(name: string): string {
    return name
        .replace(/[{}]/g, "")
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .replace(/^(get|post|put|delete|patch|api)_/i, "")
        .replace(/^(get_|post_|put_|delete_|patch_|api_)+/gi, "")
        .replace(/(^_|_$)/g, "");
}

/**
 * Ambil OpenAPI JSON dari endpoint dan konversi ke tools MCP
 */
export async function getMcpTools() {
    const data = await fetch(`${process.env.BUN_PUBLIC_BASE_URL}/docs/json`);
    const openApiJson = await data.json();
    const tools = convertOpenApiToMcpTools(openApiJson);
    return tools;
}

// === CLI Mode ===
if (import.meta.main) {
    const tools = await getMcpTools();
    await Bun.write("./tools.json", JSON.stringify(tools, null, 2));
}

```
