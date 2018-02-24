const { Structures } = require("discord.js");
const settings = require("../models/settings");
module.exports = Structures.extend("Guild", DiscordGuild => {
  return class Guild extends DiscordGuild {

    constructor(...args) {
      super(...args);
      
    }

    async getConfig() {
      const [config] = await settings.findOrCreate({ where: { id: this.id } });
      return config.dataValues;
    }

    async updateConfig(data) {
      const config = await settings.findById(this.id);
      const set = await config.update(data);
      return set.dataValues;
    }

    get store() {
      return this.client.store.findAll("guildId", this.id);
    }
  };
});