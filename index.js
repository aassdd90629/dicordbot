// 引用 discord.js 所需的 
const { Client, Events, GatewayIntentBits } = require('discord.js');
// 機器人的 token
const { DiscordBotToken } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
// const client = new Client({intents: [GatewayIntentBits.Guilds]});
const client = new Client({
    intents:[
        // 權限 設8
        GatewayIntentBits.Guilds,
        // 伺服器訊息
        GatewayIntentBits.GuildMessages,
        // 訊息內容
        GatewayIntentBits.MessageContent,
        // 使用者有誰
        GatewayIntentBits.GuildMembers,
    ],
});


// ctrl + F12 進入 Events 有甚麼事件 once 是回報一次
client.once(Events.ClientReady, c => {
    console.log(`Ready ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async ( e ) => {
    // isChatInputCommand 斜線指令
    if(!e.isChatInputCommand()) return;

    if(e.commandName == 'hello'){
        await e.reply('斜線指令');
    };
})

// client.on(Events.MessageCreate, (message) => {
//     if(message.content === '!hello'){
//         message.channel.send('Hello!');
//     }
// });

// client.on(Events.MessageDelete, (message) => {
//     console.log(message);
//     console.log(`${message.author.username} 更新了 ${message.content}`);
// })

// 使用 token 登陸
client.login(DiscordBotToken);
