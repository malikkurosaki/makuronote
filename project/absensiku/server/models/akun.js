
const { DataTypes, Model } = require('sequelize');
const { Tambahan } = require('../tambahan');
const { TambahanRouter } = require('../tambahan_router');
const { sequelize } = require('./../db');

class Akun extends Tambahan{
    static nama(){
        super.nama()
    }
}
Akun.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{ sequelize, underscored: true})

class Akuns extends TambahanRouter(Akun){}

module.exports = { Akuns }
