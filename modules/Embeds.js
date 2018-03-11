const { MessageEmbed } = require("discord.js");

/**
 * @description Makes an embed with an error
 * @param {String} type The type of error
 * @param {DiscordMessage} message The message object
 * @param {Array} [args = []] The arguments of the message
 * @returns {MessageEmbed} Sends the embed to whichever channel the original message was sent it
 */

async function embeds(type, message, args) { 
  const embed = new MessageEmbed()
    .setColor(message.guild.me.roles.highest.color || 0x00AE86);
  switch (type) {
    case "noVoiceChannel":
      embed.setAuthor("Error")
        .setDescription("You must be in a voice channel first!");
      break;
    case "emptyQueue":
      embed.setAuthor("Error")
        .setDescription("There is nothing playing!");
      break;
    case "errorVolume":
      embed.setAuthor("Error")
        .setDescription("Volume must be a value between 0 and 100.");
      break;
    case "currentVolume":
      embed.setAuthor("Volume")
        .setDescription(`Current volume is ${message.client.playlists.get(message.guild.id).connection.dispatcher.volumeLogarithmic * 100}%`);
      break;
    case "volumeSet":
      embed.setAuthor("Volume")
        .setDescription(`Volume has been set to ${args[0]}%`);
      break;
    case "queueEmbed":
      embed.setAuthor("Queue")
        .setDescription(message.client.playlists.get(message.guild.id).songs.map(song => `**-** ${song.title}`).join("\n"))      
        .setFooter(`Now playing: ${message.client.playlists.get(message.guild.id).songs[0].title}`);
      break;
    case "loopedEmbed":
      embed.setAuthor("Looped")
        .setDescription(`The song has been looped by ${message.member.displayName}`);
      break;
    case "unloopedEmbed":
      embed.setAuthor("Unlooped")
        .setDescription(`The song has been unlooped by ${message.member.displayName}`);
      break;
    case "nowPlaying":
      embed.setAuthor("Now Playing")
        .setDescription(message.client.playlists.get(message.guild.id).songs[0].title);
      break;
    case "alreadyPaused":
      embed.setAuthor("Error")
        .setDescription("The song is already paused!");
      break;
    case "paused":
      embed.setAuthor("Paused")
        .setDescription(`The song has been paused by ${message.member.displayName}.`);
      break;
    case "alreadyResumed":
      embed.setAuthor("Error")
        .setDescription("The song isn't paused!");
      break;
    case "resumed":
      embed.setAuthor("Resumed")
        .setDescription(`The song has been resume by ${message.member.displayName}.`);
      break;
    case "stopped":
      embed.setAuthor("Stopped")
        .setDescription(`The song has been stopped by ${message.member.displayName}.`);
      break;
    case "skippped":
      embed.setAuthor("Skipped")
        .setDescription(`The song has been skipped by ${message.member.displayName}.`);
      break;
    case "noArgs":
      embed.setAuthor("Error")
        .setDescription("Please provide me with some arguments!");
      break;
    case "noPerms-CONNECT":
      embed.setAuthor("Error")
        .setDescription("I cannot connect to your voice channel, make sure I have the proper permissions!");
      break;
    case "noPerms-SPEAK":
      embed.setAuthor("Error")
        .setDescription("I cannot speak in this voice channel, make sure I have the proper permissions!");
      break;
    case "invalidEntry":
      embed.setAuthor("Error")
        .setDescription("No or invalid value entered, cancelling video selection.");
      break;
    case "noSearchResults":
      embed.setAuthor("Error")
        .setDescription("I could not obtain any search results.");
      break;  
    case "inactiveCall":
      embed.setAuthor("Error")
        .setDescription("No one is in the call, leaving due to inactivity.");
      break;
    default: 
      embed.setAuthor("Error")
        .setDescription("Sorry, but an error has occured.");

  }
  return message.channel.send(embed);
}

module.exports = embeds;
