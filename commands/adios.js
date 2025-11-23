const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adios')
    .setDescription('Despedirse de manera amigable'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('👋 ¡Hasta luego!')
      .setDescription('¡Adiós! Que tengas un gran día.')
      .setImage('https://i.etsystatic.com/6721058/r/il/26eea2/4916474361/il_600x600.4916474361_jjde.jpg')
      .setColor(0xFF5733);

    try {
      // Usa flags: 64 para respuesta efímera (si deseas que sea privada)
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [embed], flags: 64 });
      } else {
        await interaction.followUp({ embeds: [embed], flags: 64 });
      }
    } catch (error) {
      console.error('❌ Error en comando adios:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '⚠️ No se pudo enviar el mensaje de despedida.', flags: 64 });
      }
    }
  },

  activo: true
};