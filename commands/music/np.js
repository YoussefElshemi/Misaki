/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);

class NP extends Command {
  constructor(client) {
    super(client, {
      name: "np",
      description: "This command will display the current playing song.",
      usage: "np",
      category: "Music",
      aliases: ["nowplaying"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
    return this.client.embed("nowPlaying", message);
  }
} 

module.exports = NP;
