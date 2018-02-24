require(`${process.cwd()}/extenders/Guild.js`);
require(`${process.cwd()}/modules/Prototypes.js`);
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const MisakiClient = require("./structures/MisakiClient.js");
const client = new MisakiClient({
  fetchAllMembers: false,
  disableEveryone: true,
  disabledEvents:["CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "GUILD_SYNC", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "USER_NOTE_UPDATE", "USER_SETTINGS_UPDATE", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"]
});

client.login(client.config.token);

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

process.on("unhandledRejection", error => console.log(`unhandledRejection:\n${error.stack}`))
  .on("error", error => console.log(`Error:\n${error.stack}`))
  .on("warn", error => console.log(`Warning:\n${error.stack}`));