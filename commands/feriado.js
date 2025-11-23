const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feriado')
    .setDescription('Muestra información sobre el feriado'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Feriado')
      .setDescription('Aquí está la información sobre el feriado...')
      .addFields(
        { name: 'Fecha', value: '1 de enero', inline: true },
        { name: 'Nombre', value: 'Año Nuevo', inline: true },
        { name: 'Descripción', value: 'Celebración del nuevo año', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Feriado - Información sobre el feriado' });

    await interaction.reply({ embeds: [embed] });
  },
};