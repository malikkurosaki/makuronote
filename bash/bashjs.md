```sh
const { exec } = require('child_process');
async function Exec(args)  {
    console.log("Executing: " + args);
    return new Promise((resolve, reject) => {
        exec(args, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                stdout,
                stderr
            });
        });
    });
}

module.exports = {Exec}
```
