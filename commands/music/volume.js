/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);

class Volume extends Command {
  constructor(client) {
    super(client, {
      name: "volume",
      description: "This command will set the volume of the songs.",
      usage: "volume [number]",
      category: "Music"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
    if (!args[0]) return this.client.embed("currentVolume", message);
    if (Number(args[0]) < 0 || Number(args[0]) > 100) return this.client.embed("errorVolume", message);
    message.guild.voiceConnection.volume = Number(args[0]) / 100;
    this.client.playlists.get(message.guild.id).volume = Number(args[0]);
    this.client.playlists.get(message.guild.id).connection.dispatcher.setVolumeLogarithmic(Number(args[0]) / 100);
    return this.client.embed("volumeSet", message, args);
  }
}

module.exports = Volume;
