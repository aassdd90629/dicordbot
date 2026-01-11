const { SlashCommandBuilder } = require('discord.js');
// 在這裡新增指令
module.exports = {
    data: new SlashCommandBuilder()
    // 這兩行是設定指令名稱跟描述
        .setName('settime')
        .setDescription('自動偵測頻道並標記對應身分組')
        .addStringOption(option =>
        option.setName('message')
                .setDescription('要發送的訊息內容')
                .setRequired(true))
        .addRoleOption(option =>
        option.setName('target_role')
            .setDescription('要標記的身分組')
            .setRequired(true)),
    async execute(interaction) {
        const messageText = interaction.options.getString('message');
        const role = interaction.options.getRole('target_role');

        await interaction.reply({
            content: `<@&${role.id}> ${messageText} `,
            allowedMentions: { roles: [role.id] }
        });
    },
};