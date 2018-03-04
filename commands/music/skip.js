/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const embed = require("../../modules/Embeds.js");

class Skip extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      description: "This command will skip a current playing song.",
      usage: "skip",
      category: "Music",
      aliases: ["next"],
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return embed("emptyQueue", message);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    thisPlaylist.loop = false;
    thisPlaylist.connection.dispatcher.end("skip");
    return embed("stopped", message);
  }
}

module.exports = Skip;