const { Client, Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");
const Database = require("./Database");
// const Enmap = require("enmap");
// const EnmapLevel = require("enmap-level");
const Idiot = require("idiotic-api");
class Misaki extends Client {

  constructor(options) {
    super(options);
    require("../modules/functions.js")(this);
    this.config = require(`${process.cwd()}/config.js`);
    this.logger = require(`${process.cwd()}/util/Logger`);
    this.responses = require(`${process.cwd()}/assets/responses.js`);
    this.idiotAPI = new Idiot.Client(this.config.apiTokens.idiotToken, { dev: true });

    this.aliases = new Collection();
    this.commands = new Collection();
    this.upvoters = [];
    this.ratelimits = new Collection();

    // this.points = new Enmap({provider: new EnmapLevel({ name: "points" }) });
    // this.store = new Enmap({provider: new EnmapLevel({ name: "shop" }) });
    // this.inventory = new Enmap({provider: new EnmapLevel({ name: "inventory" }) });
    this.database = Database.db;
    this.levelCache = {};
    this.ready = false;

    this.once("ready", () => this._ready());
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }

  _ready() {
    Database.start();
    this.ready = true;
    this.emit("apiReady");
  }
  
  permlevel(message) {
    let permlvl = 0;
  
    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
  
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }
  
  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  async init() {
    const commandList = [];
    klaw("./commands").on("data", (item) => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== ".js") return;
      const response = this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
      commandList.push(cmdFile.name);
      if (response) this.logger.error(response);
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${commandList.length} commands.`);
    }).on("error", (error) => this.logger.error(error));
    
    const extendList = [];
    klaw("./extenders").on("data", (item) => {
      const extFile = path.parse(item.path);
      if (!extFile.ext || extFile.ext !== ".js") return;
      try {
        require(`${extFile.dir}${path.sep}${extFile.base}`);
        extendList.push(extFile.name);
      } catch (error) {
        console.log(error);
        this.logger.error(`Error loading ${extFile.name} extension: ${error}`);
      }
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${extendList.length} extensions.`);
    }).on("error", (error) => this.logger.error(error));
    
    const eventList = [];
    klaw("./events").on("data", (item) => {  
      const eventFile = path.parse(item.path);
      if (!eventFile.ext || eventFile.ext !== ".js") return;
      const eventName = eventFile.name.split(".")[0];
      try {
        const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(this);    
        eventList.push(event);      
        this.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
      } catch (error) {
        this.logger.error(`Error loading event ${eventFile.name}: ${error}`);
      }
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${eventList.length} events.`);
    }).on("error", (error) => this.logger.error(error));
      
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
  }
  
}

module.exports = Misaki;