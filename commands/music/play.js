/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const handleVideo = require("../../modules/MusicHandling.js");
const youtube = new ytapi("API KEY"); 
const embed = require("../../modules/Embeds.js");

class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "This command will allow the bot to play a song.",
      usage: "play <url|song-name|video id>",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return embed("noVoiceChannel", message);
    if (!args[0]) return embed("noArgs", message);
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return embed("noPerms-CONNECT", message);
    if (!permissions.has("SPEAK")) return embed("noPerms-SPEAK");
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      const embed = new MessageEmbed()
        .setAuthor("Playlist")
        .setDescription(`✅ Playlist: **${playlist.title}** has been added to the queue!`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
    } else {
      let video;
      try {
        video = await youtube.getVideo(url);
      } catch (error) {
        const videos = await youtube.searchVideos(args.join(" "), 1);
        video = await youtube.getVideoByID(videos[0].id);          
      }
      return handleVideo(video, message, voiceChannel);
    }
  }
}

module.exports = Play;
