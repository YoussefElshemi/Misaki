const Owner = require(`${process.cwd()}/base/Owner.js`);

class Reboot extends Owner {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "Owner",
      usage: "reboot",
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    await message.channel.send(`${this.client.responses.rebootMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    this.client.commands.forEach(async cmd => {
      await this.client.unloadCommand(cmd);
    });
    process.exit(1);
  }
}

module.exports = Reboot;