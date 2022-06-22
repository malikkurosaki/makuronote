```js
function typeNya(data) {
  if (typeof data === "string") {
    return "String";
  } else if (typeof data === "number") {
    return "int";
  } else if (typeof data === "boolean") {
    return "bool";
  } else if (Array.isArray(data)) {
    return "List";
  } else if (data instanceof Object) {
    return "Map";
  } else {
    return "var";
  }
}


const GenerateBodyStatus = async () => {
  let tables = Object.keys(prisma).filter((x) => !x.includes("_"));

  for (let table of tables) {
    const file = path.join(
      __dirname,
      `../../client/lib/models/model_${_.snakeCase(table)}.dart`
    );

    const issueStatus = await prisma[table].findFirst();

    if (issueStatus) {
      let defines = "";
      let construct = "";
      let fromJsonItem = "";
      let toJsonItem = "";
      for (let status of Object.keys(issueStatus)) {
        defines += `
        ${typeNya(status)}? ${status};`;

        construct += `
        this.${status},`;

        fromJsonItem += `
        ${status} = json['${status}'];`;

        toJsonItem += `
        data['${status}'] = ${status};`;
      }

      let isi = `
        class ModelBody${_.upperFirst(_.camelCase(table))} {
            ${defines}
            
            ModelBody${_.upperFirst(_.camelCase(table))}({
                ${construct}
            });

            ModelBody${_.upperFirst(
              _.camelCase(table)
            )}.fromJson(Map<String, dynamic> json) {
                ${fromJsonItem}
            }

            Map<String, dynamic> toJson() {
            final Map<String, dynamic> data = <String, dynamic>{};
                ${toJsonItem}
            return data;
          }
        }
    `;

      fs.writeFileSync(file, isi.trim(), { encoding: "utf-8" });
      console.log(`generate model body ${table} success`);
    }
  }

  // dart format
  execSync(`dart format ${path.join(__dirname, '../../client/lib/models')}`, { stdio: 'inherit' });
};
```
