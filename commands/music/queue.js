/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const embed = require("../../modules/Embeds.js");

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
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!this.client.playlists.has(message.guild.id)) return embed("emptyQueue", message);
    return embed("queueEmbed", message);
  } 
}

module.exports = Queue;