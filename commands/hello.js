const { SlashCommandBuilder } = require('discord.js');
// 在這裡新增指令
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('打招呼指令'),
    async execute(interaction) {
        await interaction.reply('Hello World!');
    },
};