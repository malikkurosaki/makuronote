<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

