// 新增機器人指令用
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { DiscordBotToken, ApplicationID, aassdd51263sever } = require('./config.json');
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
// const commands = [
//     new SlashCommandBuilder()
//         .setName('hello')
//         .setDescription('我是機器人')
// ].map( command => command.toJSON());

const rest = new REST({version: '10'}).setToken(DiscordBotToken);

(async () => {
    try {
        console.log(`正在更新 ${commands.length} 個斜線指令...`);

        await rest.put(
            Routes.applicationGuildCommands( ApplicationID, aassdd51263sever),
            { body: commands },
        );

        console.log('成功註冊指令！');
    } catch (error) {
        console.error(error);
    }
})();