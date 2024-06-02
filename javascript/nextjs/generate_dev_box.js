const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require('fs');
const prettier = require('prettier');

const code = fs.readFileSync('test_view.tsx', 'utf8');

async function main() {
  let ast;
  try {
    // Parse code into AST
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"]
    });
  } catch (error) {
    console.error("Parsing error:", error.message);
    return;
  }

  // Traverse the AST to find the main body of the default export function
  let mainBody = "";
  let start = 0;
  let end = 0;

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        path.traverse({
          ReturnStatement(innerPath) {
            if (innerPath.node.argument && innerPath.node.argument.type === "JSXElement") {
              const openingElement = innerPath.node.argument.loc.start;
              const closingElement = innerPath.node.argument.loc.end;

              start = innerPath.node.argument.start;
              end = innerPath.node.argument.end;

              mainBody = code.substring(start, end);
            }
          }
        });
      }
    });
  } catch (error) {
    console.error("Traversal error:", error.message);
    return;
  }

  if (mainBody) {
    const newCode = code.slice(0, start) + `<DivBox>\n${mainBody}\n</DivBox>` + code.slice(end);

    // Format the new code with prettier
    const formattedCode = await prettier.format(newCode, { parser: "typescript" });

    fs.writeFileSync('test_view2.tsx', formattedCode);
    console.log("New file created: test_view2.tsx");
  } else {
    console.log("No main body found in the default export function.");
  }
}

main();
