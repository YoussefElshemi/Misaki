/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "This command will resume the currently paused song.",
      usage: "resume",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (thisPlaylist.playing) return this.client.embed("alreadyResumed", message);
    thisPlaylist.playing = true;
    thisPlaylist.connection.dispatcher.resume();
    return this.client.embed("resumed", message);
  }
}

module.exports = Pause;
