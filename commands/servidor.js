const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servidor')
    .setDescription('Muestra estadísticas del servidor de Discord'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Servidor')
      .setDescription('Aquí están las estadísticas del servidor de Discord...')
      .addFields(
        { name: 'ID del servidor', value: interaction.guild.id, inline: true },
        { name: 'Nombre del servidor', value: interaction.guild.name, inline: true },
        { name: 'Número de miembros', value: interaction.guild.memberCount.toString(), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Servidor - Discord Server Data Statistics' });

    await interaction.reply({ embeds: [embed] });
  },
};