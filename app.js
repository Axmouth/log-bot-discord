secret = "NDg1OTY3NzU2MDY4NjUxMDA4.DoeVXQ.W7rwO5eoO0WOQ52tmfgAR8c1Upc";
inv_link = "https://discordapp.com/api/oauth2/authorize?client_id=485967756068651008&permissions=363584&scope=bot";
log_chan_id = "393862821491900437";

const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();

var log_chan;

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: './DB/test.database.sqlite'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

function sendMessage(content, guild) {

}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    log_chan = client.channels.get("393862821491900437");
    // console.log(log_chan);
});

/*
client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});
*/

client.on('messageDelete', msg => {
    var replyMsg = "";
    replyMsg += `Message deleted by **${msg.author.tag}** (ID: **${msg.author.id}**)\n`;
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
        log_chan.send(replyMsg);
    }
});

client.on('messageDeleteBulk', messages => {
    var replyMsg = "";
    const messagesArray = messages.array();
    replyMsg += `${messagesArray.length} Messages deleted in bulk\n`;
    var messageCounter;
    for (messageCounter = 0; messageCounter < messagesArray.length; messageCounter++) {
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
        log_chan.send(replyMsg);
    }
});

client.on('messageUpdate', (oldMsg, newMsg) => {
    var replyMsg = "";
    replyMsg += `Message edited by **${oldMsg.author.tag}** (ID: **${oldMsg.author.id}**)\n`;
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
        log_chan.send(replyMsg);
    }
});

client.on('roleCreate', role => {
    log_chan.send(`Role **${role.name}** was created.\n`);
});

client.on('roleDelete', role => {
    log_chan.send(`Role **${role.name}** was deleted.\n`);
});

client.on('roleUpdate', role => {
    log_chan.send(`Role **${role.name}** was updated.\n`);
});

client.on('guildBanAdd', (guild, user) => {
    log_chan.send(`User **${user.tag}** (ID: **${user.id}**) has been banned from **${guild.name}**.\n`);
});

client.on('guildBanRemove', (guild, user) => {
    log_chan.send(`User **${user.tag}** (ID: **${user.id}**) has had their banned removed from **${guild.name}**.\n`);
});

client.on('emojiCreate', emoji => {
    log_chan.send(`Emoji **:${emoji.name}:** was created.\n`);
    const attachment = new Discord.Attachment(emoji.url);
    log_chan.send(attachment);
});

client.on('emojiDelete', emoji => {
    log_chan.send(`Emoji **:${emoji.name}:** was deleted.\n`);
    const attachment = new Discord.Attachment(emoji.url);
    log_chan.send(attachment);
});

client.on('emojiUpdate', (oldEmoji, newEmoji) => {
    log_chan.send(`Emoji **:${oldEmoji.name}:** was updated.\n`);
    const attachment = new Discord.Attachment(oldEmoji.url);
    log_chan.send(attachment);
});

client.login(secret);