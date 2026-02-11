// 建立一個HTPP伺服器
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('機器人運作中！'));
app.listen(port, () => console.log(`監聽埠號： ${port}`));

// 引用 discord.js 所需的 
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
// 機器人的 token
const fs = require('node:fs');
const path = require('node:path');
// const client = new Client({intents: [GatewayIntentBits.Guilds]});
const client = new Client({
    intents:[
        // 權限 設8
        GatewayIntentBits.Guilds,
        // // 伺服器訊息
        // GatewayIntentBits.GuildMessages,
        // // 訊息內容
        // GatewayIntentBits.MessageContent,
        // // 使用者有誰
        // GatewayIntentBits.GuildMembers,
    ],
});

client.commands  = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(let i = 0; i < commandFiles.length; i++){
    const file = commandFiles[i];
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
        console.log(`已載入${command.data.name}`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // 從 Collection 中根據名稱抓取對應的指令物件
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`找不到名稱為 ${interaction.commandName} 的指令。`);
        return;
    }

    try {
        // 執行該指令檔案中的 execute 函數
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '執行指令時發生錯誤！', ephemeral: true });
        } else {
            await interaction.reply({ content: '執行指令時發生錯誤！', ephemeral: true });
        }
    }
});


// ctrl + F12 進入 Events 有甚麼事件 once 是回報一次
client.on(Events.ClientReady, c => {
    console.log(`Ready ${c.user.tag}`);
});

// token login

// 優先順序：環境變數 (Render) > 本地 config.json (測試)
const token = process.env.TOKEN || (function() {
    try {
        return require('./config.json').DiscordBotToken;
    } catch (e) {
        return null;
    }
})();

if (token == null) {
    console.log('沒有');
    console.error("❌ 錯誤：找不到 Token。請檢查 Render 環境變數或 config.json");
    process.exit(1);
}else{
    console.log(token.length)
    console.log('--- 啟動程序 ---');

    // 監控所有 WebSocket 除錯資訊
    client.on('debug', info => {
        if(info.includes('heartbeat')) return; // 過濾掉心跳包避免洗版
        console.log(`[Discord Debug] ${info}`);
    });

    client.login(token).then(() => {
        console.log('Login Promise 已完成解析');
    });
}
