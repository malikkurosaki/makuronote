const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require('fs');
const prettier = require('prettier');

let code = fs.readFileSync('test_view.tsx', 'utf8');

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

    try {
        const newCodeSegments = [];
        let lastIndex = 0;

        traverse(ast, {
            ReturnStatement(innerPath) {
                if (innerPath.node.argument && innerPath.node.argument.type === "JSXElement") {
                    const jsxElement = innerPath.node.argument;

                    // Check if the JSXElement is already wrapped with DivBox
                    const openingElement = jsxElement.openingElement.name.name;
                    if (openingElement === "DivBox") {
                        return;
                    }

                    const start = jsxElement.loc.start.index;
                    const end = jsxElement.loc.end.index;
                    const mainBody = code.substring(start, end);

                    // Add previous segment and the wrapped JSXElement
                    newCodeSegments.push(code.substring(lastIndex, start));
                    newCodeSegments.push(`<DivBox>\n${mainBody}\n</DivBox>`);
                    lastIndex = end;
                }
            }
        });

        // Add the remaining part of the code
        newCodeSegments.push(code.substring(lastIndex));

        const newCode = newCodeSegments.join('');

        // Format the new code with prettier
        const formattedCode = await prettier.format(newCode, { parser: "typescript" });

        fs.writeFileSync('test_view2.tsx', formattedCode);
        console.log("New file created: test_view2.tsx");
    } catch (error) {
        console.error("Traversal error:", error.message);
        return;
    }
}

main();
