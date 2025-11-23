const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duds')
    .setDescription('Muestra estadísticas de usuario de Discord'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Simulación de proceso lento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Creamos el embed con datos del usuario
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`📊 Estadísticas de ${interaction.user.username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '🆔 ID', value: interaction.user.id, inline: true },
        { name: '👤 Usuario', value: interaction.user.tag, inline: true },
        { name: '📅 Creado el', value: interaction.user.createdAt.toDateString(), inline: false }
      )
      .setFooter({ text: 'Comando duds', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  activo: true
};
