const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require('fs');
const prettier = require('prettier');

let code = fs.readFileSync('test_view2.tsx', 'utf8');

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
            JSXElement(path) {
                const openingElement = path.node.openingElement.name.name;
                if (openingElement === "DivBox") {
                    const start = path.node.loc.start.index;
                    const end = path.node.loc.end.index;
                    const innerJSX = path.node.children.map(child => code.substring(child.loc.start.index, child.loc.end.index)).join('');

                    // Add previous segment and the inner JSX
                    newCodeSegments.push(code.substring(lastIndex, start));
                    newCodeSegments.push(innerJSX);
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
