// 引用 discord.js 所需的 
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
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
// client.on(Events.InteractionCreate, async ( e ) => {
//     // isChatInputCommand 斜線指令
//     if(!e.isChatInputCommand()) return;

//     if(e.commandName == 'hello'){
//         await e.reply('斜線指令');
//     };
// })

// client.on(Events.MessageCreate, (message) => {
//     if(message.content === '!hello'){
//         message.channel.send('Hello!');
//     }
// });

// client.on(Events.MessageDelete, (message) => {
//     console.log(message);
//     console.log(`${message.author.username} 更新了 ${message.content}`);
// })

// ctrl + F12 進入 Events 有甚麼事件 once 是回報一次
client.once(Events.ClientReady, c => {
    console.log(`Ready ${c.user.tag}`);
});


// token login
client.login(DiscordBotToken);
