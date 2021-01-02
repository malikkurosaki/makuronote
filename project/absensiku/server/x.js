const { Model, DataTypes } = require("sequelize");
const { Akun, Maka } = require("./models/akun");
const { Tambahan } = require("./tambahan");
const { TambahanRouter } = require("./tambahan_router");
const { sequelize } = require("./db");
const { Gambars } = require("./models/gambar");
const query = sequelize.getQueryInterface();

const x = process.argv.splice(2);

;(async () => {
    switch (x[0]){
        case "--coba":
            console.log(JSON.stringify(await Akun.lihatSemua(), null, 2));
        break;
        case "--aktifkan":
            await Gambars.aktifkanForce()
        break;
        case "--terangkan":
            console.log(JSON.stringify(await Akun.terangkan(), null, 2))
        break;
        case "--simpan":
            await Akun.create({name: "malik"});
        break;
        case "--lihat":
            try {
                console.log(JSON.stringify(await Akun.lihat(), null, 2));
            } catch (error) {
                console.log(error.message);
            }
        break;
        case "--cb":
            try {
                let lihat = (obj) => Object.getOwnPropertyNames(obj).filter(name => typeof obj[name] === 'function')
                console.log(lihat(Model))
            } catch (error) {
                console.log(error.message);
            }
        break;
        case "--migrasi":
            await query.changeColumn('akuns','email', { type: DataTypes.STRING, allowNull: false, unique: true });
        break;
        case "--lihat-tabel":
            console.log(JSON.stringify(await query.showAllTables()))
        break;
        case "--describe":
            console.log(JSON.stringify(await  query.describeTable('akuns'), null, 2))
        break;
    }

})()