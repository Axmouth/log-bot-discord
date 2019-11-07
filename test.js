// start discord.js init
const config = require("./config/config.json"); // See config.json below for example
const Discord = require("discord.js"); // Code below supports and is tested under "stable" 11.3.x
const client = new Discord.Client();
// end discord.js init

// Initialize **or load** the server configurations
const Enmap = require('enmap');

// I attach settings to client to allow for modular bot setups
// In this example we'll leverage fetchAll:false and autoFetch:true for
// best efficiency in memory usage. We also have to use cloneLevel:'deep'
// to avoid our values to be "reference" to the default settings.
// The explanation for why is complex - just go with it.
client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

(async function () {
  const defer = await client.settings.defer;
  console.log(client.settings.size + " keys loaded");
  // Ready to use!

  const defaultSettings = {
    prefix: "!",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    welcomeChannel: "welcome",
    welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
  }

  guild_id = "4545454544";

  console.log(client.settings.delete(guild_id));

  const guildConf = client.settings.ensure(guild_id, defaultSettings);

  console.log(client.settings.has(guild_id, "welcomeChannel"));

  console.log(client.settings.set(guild_id, "general", "welcomeChannel"));
}());