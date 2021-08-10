```js
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('tigaputri', '***', '***', {
    host: '139.180.217.11',
    dialect: 'mssql',
    port: '1434',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        options: {
            encrypt: false,
            useUTC: false,
            dateFirst: 1,
        }
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        const a = await sequelize.query("SELECT TABLE_NAME as 'table' FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'");

        console.log(a);

    } catch (error) {
        console.log(error);
    }
})();
```
