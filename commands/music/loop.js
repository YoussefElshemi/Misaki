/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const embed = require("../../modules/Embeds.js");

class Loop extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "This command will loop the current playing song.",
      usage: "loop",
      category: "Music",
      aliases: ["unloop"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return embed("emptyQueue", message);
    if (thisPlaylist.loop) {
      thisPlaylist.loop = false;
      return embed("unloopedEmbed", message);
    } else {
      thisPlaylist.loop = true;
      return embed("loopedEmbed", message);
    }
  }
}

module.exports = Loop;
