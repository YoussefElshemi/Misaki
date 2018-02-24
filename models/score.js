const Sequelize = require("sequelize");
const Database = require("../structures/Database");

const Score = Database.db.define("economy", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  }, 
  points: {
    type: Sequelize.NUMERIC,
    defaultValue: 0,
    allowNull: false
  }, 
  level: {
    type: Sequelize.NUMERIC,
    defaultValue: 0,
    allowNull: false
  }, 
  userid: {
    type: Sequelize.STRING,
    defaultValue: "replace-this",
    allowNull: false
  }, 
  guildid: {
    type: Sequelize.STRING,
    defaultValue: "replace-this",
    allowNull: false
  }, 
  daily: {
    type: Sequelize.NUMERIC,
    defaultValue: 1504120109,
    allowNull: false
  }
});

module.exports = Score;