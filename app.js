const config = require("./config/config.json");
const staticData = require("./staticData.js");
const Discord = require("discord.js");
const Enmap = require("enmap");

const client = new Discord.Client();

client.settings = new Enmap({
  name: "settings"
});

const eventsList = staticData.eventsList;
const defaultSettings = staticData.defaultSettings;

async function sendMessage(content, guild) {
  var guildConf = client.settings.ensure(guild.id, defaultSettings);
  if (client.settings.has(guild.id, "loggingChannel")) {
    var log_channel_id = client.settings.get(guild.id, "loggingChannel");
    if (log_channel_id !== -1) {
      var log_channel = client.channels.get(log_channel_id);
      return await log_channel.send(content);
    }
  }
}

client.on("guildDelete", guild => {
  // Removing an element uses `delete(key)`
  client.settings.delete(guild.id);
});

client.on("ready", () => {
  client.user
    .setActivity("your every move.", {
      type: "WATCHING"
    })
    .then(presence =>
      console.log(
        `Activity set to ${presence.game ? presence.game.name : "none"}`
      )
    )
    .catch(console.error);
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(log_chan);
});

client.on("message", async msg => {
  if (msg.isMentioned(client.user)) {
    // First, ensure the settings exist
    client.settings.ensure(msg.guild.id, defaultSettings);
    // msg.reply('message here');
    if (msg.content.toLowerCase().includes("setlogchannel")) {
      client.settings.set(msg.guild.id, msg.channel.id, "loggingChannel");
    } else if (msg.content.toLowerCase().includes("dashboard")) {
      createDashboard(msg.guild);
    } else if (msg.content.toLowerCase().includes("test")) {
      console.log((await sendMessage("test", msg.guild)).id);
    }
  }
});

client.on("messageDelete", msg => {
  var replyMsg = "";
  replyMsg += `Message deleted by **${msg.author.tag}** (ID: **${
    msg.author.id
  }**)\n`;
  var attachments = msg.attachments.array();
  if (attachments.length > 0) {
    replyMsg += "► Attachments:\n";
    var i = 0;
    for (i = 0; i < attachments.length; i++) {
      replyMsg += attachments[i].proxyURL + "\n";
    }
  }
  if (msg.content) {
    replyMsg += `► Content:\n\`\`\`${msg.content}\`\`\``;
  }
  if (replyMsg) {
    sendMessage(replyMsg, msg.guild);
  }
});

client.on("messageDeleteBulk", messages => {
  var replyMsg = "";
  const messagesArray = messages.array();
  replyMsg += `${messagesArray.length} Messages deleted in bulk\n`;
  var messageCounter;
  for (
    messageCounter = 0; messageCounter < messagesArray.length; messageCounter++
  ) {
    msg = messagesArray[messageCounter];
    replyMsg += "► Author: **${msg.author.tag}** (ID: **${msg.author.id}**)\n";
    var attachments = msg.attachments.array();
    if (attachments.length > 0) {
      replyMsg += "► Attachments:\n";
      var i = 0;
      for (i = 0; i < attachments.length; i++) {
        replyMsg += attachments[i].proxyURL + "\n";
      }
    }
    if (msg.content) {
      replyMsg += `► Content:\n\`\`\`${msg.content}\`\`\``;
    }
    replyMsg += "\n\n";
  }
  if (replyMsg) {
    sendMessage(replyMsg, msg.guild);
  }
});

client.on("messageUpdate", (oldMsg, newMsg) => {
  var replyMsg = "";
  replyMsg += `Message edited by **${oldMsg.author.tag}** (ID: **${
    oldMsg.author.id
  }**)\n`;
  var attachments = oldMsg.attachments.array();
  if (attachments.length > 0) {
    replyMsg += "► Attachments:\n";
    var i = 0;
    for (i = 0; i < attachments.length; i++) {
      replyMsg += attachments[i].proxyURL + "\n";
    }
  }
  replyMsg += `► Old Content:\n\`\`\` \n${oldMsg.content}\n \`\`\`\n`;
  replyMsg += `► New Content:\n\`\`\` \n${newMsg.content}\n \`\`\`\n`;

  if (replyMsg) {
    sendMessage(replyMsg, oldMsg.guild);
  }
});

client.on("roleCreate", role => {
  sendMessage(`Role **${role.name}** was created.\n`, role.guild);
});

client.on("roleDelete", role => {
  sendMessage(`Role **${role.name}** was deleted.\n`, role.guild);
});

client.on("roleUpdate", role => {
  sendMessage(`Role **${role.name}** was updated.\n`, role.guild);
});

client.on("guildBanAdd", (guild, user) => {
  sendMessage(
    `User **${user.tag}** (ID: **${user.id}**) has been banned from **${
      guild.name
    }**.\n`,
    guild
  );
});

client.on("guildBanRemove", (guild, user) => {
  sendMessage(
    `User **${user.tag}** (ID: **${
      user.id
    }**) has had their banned removed from **${guild.name}**.\n`,
    guild
  );
});

client.on("emojiCreate", emoji => {
  sendMessage(`Emoji **:${emoji.name}:** was created.\n`, emoji.guild);
  const attachment = new Discord.Attachment(emoji.url);
  sendMessage(attachment, emoji.guild);
});

client.on("emojiDelete", emoji => {
  sendMessage(`Emoji **:${emoji.name}:** was deleted.\n`, emoji.guild);
  const attachment = new Discord.Attachment(emoji.url);
  sendMessage(attachment, emoji.guild);
});

client.on("emojiUpdate", (oldEmoji, newEmoji) => {
  sendMessage(`Emoji **:${oldEmoji.name}:** was updated.\n`, emoji.guild);
  const attachment = new Discord.Attachment(oldEmoji.url);
  sendMessage(attachment, emoji.guild);
});

(async function () {
  await client.settings.defer;
  console.log(client.settings.size + " keys loaded");
  // Ready to use!
  client.login(config.token);
})();

async function createDashboard(guild) {
  var i;
  for (i = 0; i < eventsList.length; i++){
    if(!eventsList[i].loggable) {
      continue;
    }
    var guildConf = client.settings.ensure(guild.id, defaultSettings);
    var pendingMessage = eventsList[i].name + eventsList[i].description;
    var toggled = client.settings.get(guild.id, eventsList[i].name);
    var toggledReact;
    if(toggled) {
      toggledReact = "✅";
      toggledString = "❌";
    }
    else {
      toggledReact = "❌";
      toggledString = "✅";
    }
    pendingMessage += " " + toggledString;
    sentMessage = await sendMessage(pendingMessage, guild);
    await sentMessage.react(toggledReact);
  }
  
}