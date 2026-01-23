// 新增機器人指令用
require('dotenv').config(); 

let token;
let clientId;
let guildIds = [];

try {
    const config = require('./config.json');
    token = config.DiscordBotToken;
    clientId = config.ApplicationID;
    
    if (config.aassdd51263sever) guildIds.push(config.aassdd51263sever);
    if (config.bosssever) guildIds.push(config.bosssever);

} catch (error) {
    token = process.env.TOKEN;
    clientId = process.env.CLIENT_ID;
    if (process.env.TEST_SERVER_ID) guildIds.push(process.env.TEST_SERVER_ID);
    if (process.env.BOSS_SERVER_ID) guildIds.push(process.env.BOSS_SERVER_ID);
}

if (!token) {
    console.error("找不到機器人 Token");
    process.exit(1);
}

if (!clientId) {
    console.error("找不到 Application ID (Client ID)");
}

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const commands = [];
// 取得 commands 資料夾的路徑
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (let i = 0; i < commandFiles.length; i++) {
    const file = commandFiles[i];
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`${filePath} 缺少必要的 "data" 或 "execute" 屬性。`);
    }
}


const rest = new REST({version: '10'}).setToken(token);

(async () => {
    try {
        console.log(`正在更新 ${commands.length} 個斜線指令...`);

        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        }

        console.log('成功註冊指令！');
    } catch (error) {
        console.error(error);
    }
})();