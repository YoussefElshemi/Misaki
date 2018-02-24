const { Structures } = require("discord.js");
const reminders = require("../models/reminders");
const score = require("../models/score");

module.exports = Structures.extend("GuildMember", DiscordGuildMember => {
  return class GuildMember extends DiscordGuildMember {

    constructor(...args) {
      super(...args);
      this.fullId = `${this.guild.id}-${this.id}`;
    }

    async reminders() {
      const reminderList = await reminders.findAll({ where: { userid: this.id } });
      if (!reminderList) return false;
      return reminderList;
    }

    async createReminder(id, userid, guildid, reminder, timestamp) {
      await reminders.create({ id, userid, guildid, reminder, timestamp });
    }

    async score() {
      const scores = await score.findById(this.fullId);
      return scores;
    }

    get inventory() {
      if (!this.client.inventory.get(this.fullId)) return { keys: 0, crates: 0, tokens: 0 };
      return this.client.inventory.get(this.fullId);
    }

    giveItem(item, amount) {
      const inv = this.inventory;
      inv[item] += parseInt(amount);
      return this.client.inventory.set(this.fullId, inv);
    }
    
    takeItem(item, amount) {
      const inv = this.inventory;
      inv[item] -= parseInt(amount);
      return this.client.inventory.set(this.fullId, inv);
    }
    
    givePoints(points) {
      const score = this.score;
      score.points += points;
      return this.client.points.set(this.fullId, score);
    }

    takePoints(points) {
      const score = this.score;
      score.points -= points;
      return this.client.points.set(this.fullId, score);
    }

    setLevel(level) {
      const score = this.score;
      score.level = level;
      return this.client.points.set(this.fullId, score);
    }

  };
});
