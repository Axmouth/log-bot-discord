const eventsList = [{
        name: "channelCreate",
        description: "",
        loggable: true
    },
    {
        name: "channelDelete",
        description: "",
        loggable: true
    },
    {
        name: "channelPinsUpdate",
        description: "",
        loggable: true
    },
    {
        name: "channelUpdate",
        description: "",
        loggable: true
    },
    {
        name: "clientUserGuildSettingsUpdate",
        description: "",
        loggable: false
    },
    {
        name: "clientUserSettingsUpdate",
        description: "",
        loggable: false
    },
    {
        name: "debug",
        description: "",
        loggable: false
    },
    {
        name: "disconnect",
        description: "",
        loggable: false
    },
    {
        name: "emojiCreate",
        description: "",
        loggable: true
    },
    {
        name: "emojiDelete",
        description: "",
        loggable: true
    },
    {
        name: "emojiUpdate",
        description: "",
        loggable: true
    },
    {
        name: "error",
        description: "",
        loggable: false
    },
    {
        name: "guildBanAdd",
        description: "",
        loggable: true
    },
    {
        name: "guildBanRemove",
        description: "",
        loggable: true
    },
    {
        name: "guildMemberAdd",
        description: "",
        loggable: true
    },
    {
        name: "guildMemberAvailable",
        description: "",
        loggable: true
    },
    {
        name: "guildMemberRemove",
        description: "",
        loggable: true
    },
    {
        name: "guildMembersChunk",
        description: "",
        loggable: true
    },
    {
        name: "guildMemberSpeaking",
        description: "",
        loggable: false
    },
    {
        name: "guildMemberUpdate",
        description: "",
        loggable: true
    },
    {
        name: "guildUnavailable",
        description: "",
        loggable: false
    },
    {
        name: "guildUpdate",
        description: "",
        loggable: true
    },
    {
        name: "message",
        description: "",
        loggable: false
    },
    {
        name: "messageDelete",
        description: "",
        loggable: true
    },
    {
        name: "messageDeleteBulk",
        description: "",
        loggable: true
    },
    {
        name: "messageReactionAdd",
        description: "",
        loggable: false
    },
    {
        name: "messageReactionRemove",
        description: "",
        loggable: false
    },
    {
        name: "messageReactionRemoveAll",
        description: "",
        loggable: false
    },
    {
        name: "messageUpdate",
        description: "",
        loggable: true
    },
    {
        name: "presenceUpdate",
        description: "",
        loggable: false
    },
    {
        name: "rateLimit",
        description: "",
        loggable: false
    },
    {
        name: "ready",
        description: "",
        loggable: false
    },
    {
        name: "reconnecting",
        description: "",
        loggable: false
    },
    {
        name: "resume",
        description: "",
        loggable: false
    },
    {
        name: "roleCreate",
        description: "",
        loggable: true
    },
    {
        name: "roleDelete",
        description: "",
        loggable: true
    },
    {
        name: "roleUpdate",
        description: "",
        loggable: true
    },
    {
        name: "typingStart",
        description: "",
        loggable: false
    },
    {
        name: "typingStop",
        description: "",
        loggable: false
    },
    {
        name: "userNoteUpdate",
        description: "",
        loggable: false
    },
    {
        name: "userUpdate",
        description: "",
        loggable: true
    },
    {
        name: "voiceStateUpdate",
        description: "",
        loggable: false
    },
    {
        name: "warn",
        description: "",
        loggable: false
    }
];

const defaultSettings = {
    channelCreate: true,
    channelDelete: true,
    channelPinsUpdate: true,
    channelUpdate: true,
    clientUserGuildSettingsUpdate: true,
    clientUserSettingsUpdate: true,
    // debug: true,
    // disconnect: true,
    emojiCreate: true,
    emojiDelete: true,
    emojiUpdate: true,
    // error: true,
    guildBanAdd: true,
    guildBanRemove: true,
    // guildCreate: true,
    // guildDelete: true,
    guildMemberAdd: true,
    // guildMemberAvailable: true,
    guildMemberRemove: true,
    guildMembersChunk: true,
    // guildMemberSpeaking: true,
    guildMemberUpdate: true,
    // guildUnavailable: true,
    guildUpdate: true,
    message: true,
    messageDelete: true,
    messageDeleteBulk: true,
    // messageReactionAdd: true,
    // messageReactionRemove: true,
    // messageReactionRemoveAll: true,
    messageUpdate: true,
    // presenceUpdate: true,
    // rateLimit: true,
    // ready: true,
    // reconnecting: true,
    // resume: true,
    roleCreate: true,
    roleDelete: true,
    roleUpdate: true,
    // typingStart: true,
    // typingStop: true,
    // userNoteUpdate: true,
    userUpdate: true,
    // voiceStateUpdate: true,
    // warn : true,
    loggingChannel: -1
};

module.exports.eventsList = eventsList;
module.exports.defaultSettings = defaultSettings;