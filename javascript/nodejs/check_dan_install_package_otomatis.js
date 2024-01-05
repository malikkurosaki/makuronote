require('child_process').execSync(`package_name="yargs" && [ ! -d "node_modules/$package_name" ] && yarn add "$package_name"`)
