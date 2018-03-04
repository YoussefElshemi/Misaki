/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const youtube = new ytapi("API KEY"); 
const handleVideo = require("../../modules/MusicHandling.js");
const embed = require("../../modules/Embeds.js");

class Search extends Command {
  constructor(client) {
    super(client, {
      name: "search",
      description: "This command will allow a user to choose from 10 songs.",
      usage: "search <song-name>",
      category: "Music"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!args[0]) return embed("noArgs", message);
    if (!permissions.has("CONNECT")) return embed("noPerms-CONNECT", message);
    if (!permissions.has("SPEAK")) return embed("noPerms-SPEAK");
    let video;
    try {
      const videos = await youtube.searchVideos(args.join(" "), 10);
      let index = 0;
      const embed = new MessageEmbed()
        .setAuthor("Song Selection")
        .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join("\n")}`)
        .setFooter("Please provide a value to select one of the search results ranging from 1-10.")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
      let response;
      try {
        response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
          max: 1,
          time: 10000,
          errors: ["time"]
        });
      } catch (err) {
        embed("invalidEntry", message);
      }
      const videoIndex = parseInt(response.first().content);
      video = await youtube.getVideoByID(videos[videoIndex - 1].id);
    } catch (err) {
      embed("noSearchResults", message);
    }
    return handleVideo(video, message, voiceChannel);
  }
}

module.exports = Search;
