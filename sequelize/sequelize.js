const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysql://railway:IAbtKDpHX5~2B-eev_SegOo9Clmf2RxT@monorail.proxy.rlwy.net:46278/railway")

module.exports = {
  sequelize
}