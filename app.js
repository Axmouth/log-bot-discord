#!/usr/bin/env node

const config = require("./config/config.json");
const staticData = require("./staticData.js");
const Discord = require("discord.js");
const Enmap = require("enmap");

const client = new Discord.Client();

client.settings = new Enmap({
  name: "settings",
  dataDir: process.env.ENMAP_DATA_DIR || 'data',
});

const eventsList = staticData.eventsList;
const defaultSettings = staticData.defaultSettings;

async function sendMessage(content, guild, channel = -1) {
  var guildConf = client.settings.ensure(guild.id, defaultSettings);
  if (client.settings.has(guild.id, "loggingChannel") && channel === -1) {
    var log_channel_id = client.settings.get(guild.id, "loggingChannel");
    //console.log(guild);
    if (log_channel_id !== -1) {
      var log_channel = client.channels.get(log_channel_id);
      //console.log(content);
      return log_channel.send(content).catch((err) => {
        console.log(err);
      });
    }
  } else if (channel !== -1) {
    return channel.send(content).catch((err) => {
      console.log(err);
    });
  }
}

function getLogHeader() {
  var d = new Date();
  var n = d.get;
  return "___" + d.toString() + "___\n";
};

client.on("guildDelete", guild => {
  // Removing an element uses `delete(key)`
   if (!client.settings.get(guild.id, "guildDelete")) {
     //return;
   }
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
      createDashboard(msg.guild, channel = msg.channel);
    } else if (msg.content.toLowerCase().includes("test")) {
      sendMessage("test", msg.guild, msg.channel), msg.channel;
    }
  }
});

client.on("messageDelete", msg => {
  if (client.settings.get(msg.guild.id, "messageDelete") === false) {
    return;
  }
  var replyMsg = getLogHeader();
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
    sendMessage(replyMsg, msg.guild).catch((err) => {
      console.log(err);
    });
  }
});

client.on("messageDeleteBulk", messages => {
  if (!client.settings.get(messages.array()[0].guild.id, "messageDeleteBulk")) {
    return;
  }
  var replyMsg = getLogHeader();
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
    sendMessage(replyMsg, msg.guild).catch((err) => {
      console.log(err);
    });
  }
});

client.on("messageUpdate", (oldMsg, newMsg) => {
  if (!client.settings.get(oldMsg.guild.id, "messageUpdate")) {
    return;
  }
  var replyMsg = getLogHeader();
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
    sendMessage(replyMsg, oldMsg.guild).catch((err) => {
      console.log(err);
    });
  }
});

client.on("roleCreate", role => {
  if (!client.settings.get(role.guild.id, "roleCreate")) {
    return;
  }
  sendMessage(getLogHeader() + `Role **${role.name}** was created.\n`, role.guild).catch((err) => {
    console.log(err);
  });
});

client.on("roleDelete", role => {
  if (!client.settings.get(role.guild.id, "roleDelete")) {
    return;
  }
  sendMessage(`Role **${role.name}** was deleted.\n`, role.guild).catch((err) => {
    console.log(err);
  });
});

client.on("roleUpdate", role => {
  if (!client.settings.get(role.guild.id, "roleUpdate")) {
    return;
  }
  sendMessage(`Role **${role.name}** was updated.\n`, role.guild).catch((err) => {
    console.log(err);
  });
});

client.on("guildBanAdd", (guild, user) => {
  if (!client.settings.get(guild.id, "guildBanAdd")) {
    return;
  }
  sendMessage(
    getLogHeader() +
    `User **${user.tag}** (ID: **${user.id}**) has been banned from **${
      guild.name
    }**.\n`,
    guild
  ).catch((err) => {
    console.log(err);
  });
});

client.on("guildBanRemove", (guild, user) => {
  if (!client.settings.get(guild.id, "guildBanRemove")) {
    return;
  }
  sendMessage(
    getLogHeader() +
    `User **${user.tag}** (ID: **${
      user.id
    }**) has had their banned removed from **${guild.name}**.\n`,
    guild
  ).catch((err) => {
    console.log(err);
  });
});

client.on("emojiCreate", emoji => {
  if (!client.settings.get(emoji.guild.id, "emojiCreate")) {
    return;
  }
  sendMessage(getLogHeader() + `Emoji **:${emoji.name}:** was created.\n`, emoji.guild).catch((err) => {
    console.log(err);
  });
  const attachment = new Discord.Attachment(emoji.url);
  sendMessage(attachment, emoji.guild).catch((err) => {
    console.log(err);
  });
});

client.on("emojiDelete", emoji => {
  if (!client.settings.get(emoji.guild.id, "emojiDelete")) {
    return;
  }
  sendMessage(getLogHeader() + `Emoji **:${emoji.name}:** was deleted.\n`, emoji.guild).catch((err) => {
    console.log(err);
  });
  const attachment = new Discord.Attachment(emoji.url);
  sendMessage(attachment, emoji.guild).catch((err) => {
    console.log(err);
  });
});

client.on("emojiUpdate", (oldEmoji, newEmoji) => {
  if (!client.settings.get(oldEmoji.guild.id, "emojiUpdate")) {
    return;
  }
  sendMessage(getLogHeader() + `Emoji **:${oldEmoji.name}:** was updated to **:${newEmoji.name}:**.\n`, oldEmoji.guild).catch((err) => {
    console.log(err);
  });
  const attachment = new Discord.Attachment(oldEmoji.url);
  sendMessage(attachment, oldEmoji.guild).catch((err) => {
    console.log(err);
  });
});

(async function () {
  await client.settings.defer;
  console.log(client.settings.size + " keys loaded");
  // Ready to use!
  client.login(config.token);
})();

const reactionCollectTime = 60 * 1000 * 30;

async function createDashboard(guild, channel) {
  var i;
  // eventsList.length
  for (i = 0; i < eventsList.length; i++) {
    if (eventsList[i].loggable === false) {
      continue;
    }
    var guildConf = client.settings.ensure(guild.id, defaultSettings);
    var pendingMessage = eventsList[i].name + eventsList[i].description;
    var toggled = client.settings.get(guild.id, eventsList[i].name);
    //console.log(toggled);
    var toggledReact;
    if (toggled === false) {
      //toggledReact = "✅";
      toggledString = "❌";
    } else {
      //toggledReact = "❌";
      toggledString = "✅";
    }
    pendingMessage += " " + toggledString;
    await sendMessage(pendingMessage, guild, channel).catch((err) => {
        console.log(err);
      })
      .then((message) => {
        return message.react("✅");
      })
      .catch((err) => {
        console.log(err);
      })
      .then((reaction) => {
        return reaction.message;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((message) => {
        return message.react("❌");
      })
      .catch((err) => {
        console.log(err);
      })
      .then((reaction) => {
        return reaction.message;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((message) => {
        const collector = message.createReactionCollector((reaction) => {
          return ["✅", "❌"].includes(reaction.emoji.toString()) && reaction.me && reaction.count > 1;
        }, {
          time: reactionCollectTime
        });
        //console.log(eventsList);
        var eventName = eventsList[i].name;
        var collectorDelegate = (reaction) => {
          console.log(eventName);
          //console.log(reaction);
          var newContent = "";
          if (reaction.emoji.toString() === "❌" && !reaction.message.content.includes("❌")) {
            newContent = reaction.message.content.replace("✅", "❌");
            client.settings.set(guild.id, false, eventName);
          } else if (reaction.emoji.toString() === "✅" && !reaction.message.content.includes("✅")) {
            newContent = reaction.message.content.replace("❌", "✅");
            client.settings.set(guild.id, true, eventName);
          }
          //console.log(client.settings.get(guild.id, eventsList[i].name));
          if (newContent !== "") {
            reaction.message.edit(newContent).catch((err) => {
              console.log(err);
            });
          }
        };

        collector.on('collect', (reaction) => {
          //do stuff
          
          collectorDelegate(reaction);
        });
      })
      .catch((err) => {
        console.log(err);
      });

  }

}