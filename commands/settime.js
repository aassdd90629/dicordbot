const { SlashCommandBuilder } = require('discord.js');
// 在這裡新增指令
module.exports = {
    data: new SlashCommandBuilder()
    // 這兩行是設定指令名稱跟描述
        .setName('settime')
        .setDescription('依照當前頻道去標記身分組並修改時間 機器人每10分鐘只能改2次該頻道 切勿重複修改')
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
        const channelName = interaction.channel.name;
        const channel = interaction.channel;
        const role = interaction.guild.roles.cache.find(r => channelName.includes(r.name) || r.name.includes(channelName));
        const baseName = channelName.split('-')[0];
        const newName = `${baseName}-${messageText}`;

        const GAS_URL = 'https://script.google.com/macros/s/AKfycbz2q_Ch48Imh9O_2znFsMsh9jGv4IdhmbBjymOzK5p1VlnatFwaOLvlOzbHLm_6nXc1/exec';
        if (channel.name === newName) {
           return await interaction.reply({ content: `${newName}跟頻道一樣不用改`, ephemeral: true });
        }
        if (!role) {
            return await interaction.reply({ content: `找不到與頻道 #${channelName} 的身分組。`, ephemeral: true });
        }
        try {

            await channel.setName(newName);


            await interaction.reply({
                content: `<@&${role.id}> ${messageText}`,
                allowedMentions: { roles: [role.id] }
            });

            fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({
                    user: interaction.user.tag,
                    oldName: channelName,
                    newName: newName,
                    message: messageText,
                    channelId: channel.id
                })
            }).catch(err => console.error('傳送到試算表失敗:', err));

        } catch (error) {
            console.error(error);
            
            if (error.status === 429) {
                return await interaction.reply({ 
                    content: 'Discord 規定10分鐘內只能修改2次頻道名稱。請等一下再試。', 
                    ephemeral: true 
                });
            }

            await interaction.reply({ 
                content: '執行指令時發生錯誤，請檢查機器人是否有「管理頻道」權限。', 
                ephemeral: true 
            });
        }
    },
};