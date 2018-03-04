/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "This command will display all songs in the queue.",
      usage: "queue",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
    return this.client.embed("queueEmbed", message);
  } 
}

module.exports = Queue;
