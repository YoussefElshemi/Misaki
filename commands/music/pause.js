/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const embed = require("../../modules/Embeds.js");

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      description: "This command will pause the current playing song.",
      usage: "pause",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return embed("emptyQueue", message);    
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (!thisPlaylist.playing) return embed("alreadyPaused", message);   
    thisPlaylist.playing = false;
    thisPlaylist.connection.dispatcher.pause();
    return embed("paused", message);   
  }
}

module.exports = Pause;