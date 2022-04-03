```sh
const { exec } = require('child_process');

/**
 * 
 * @param {String} args 
 * @returns {Promise<{stdout, stderr}>}
 */
async function Exec(args)  {
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

