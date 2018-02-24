const Command = require(`${process.cwd()}/base/Command.js`);

class Set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "View or change settings for your server.",
      category: "System",
      usage: "set <view/get/edit> <key> <value>",
      guildOnly: true,
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    const defaults = this.client.config.defaultSettings;
    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");
    
      const data = { [key]: value.join(" ") };
      await message.guild.updateConfig(data);
      await message.reply(`${key} successfully edited to ${value.join(" ")}`);

    } else
  
    if (action === "del" || action === "reset") {
      if (!key) return message.reply("Please specify a key to delete (reset).");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      
      const filter = m => m.author.id === message.author.id;
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the defaults \`${defaults[key]}\`?`, filter, undefined, null);

      if (["y", "yes"].includes(response)) {

        const data = { [key]: defaults[key] };
        await message.guild.updateConfig(data);
        await message.reply(`${key} was successfully reset to defaults.`);
      } else

      if (["n","no","cancel"].includes(response)) {
        message.reply(`Your setting for \`${key}\` remains at \`${await message.guild.getConfig()[key]}\``);
      }
    } else
  
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${await message.guild.getConfig()[key]}`);
      
    } else {
      const array = [];
      Object.entries(defaults).forEach(([key, value]) => {
        if (key === "updatedAt" || key === "createdAt" ||key === "id") return;
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(`= Current Guild Settings =\n${array.join("\n")}`, {code: "asciidoc"});
    }
  }
}

module.exports = Set;
