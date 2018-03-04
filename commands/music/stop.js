/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);

class Stop extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      description: "This command will stop the current playing songs and clear the queue.",
      usage: "stop",
      category: "Music",
      permLevel: "Administrator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    thisPlaylist.songs = [];
    thisPlaylist.connection.dispatcher.end();
    return this.client.embed("stopped", message);
  }
}

module.exports = Stop;
