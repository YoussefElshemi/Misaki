const Sequelize = require("sequelize");
const Database = require("../structures/Database");

const reminders = Database.db.define("reminders", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  }, 
  userid: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  guildid: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  reminder: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  timestamp: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = reminders;