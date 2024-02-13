const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize/sequelize.js");

const posts = sequelize.define("posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  post_likes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publicacao: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = {
  posts
}