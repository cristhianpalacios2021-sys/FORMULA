const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cambiaravatar')
    .setDescription('Cambia el avatar del bot desde una URL')
    .addStringOption(option =>
      option.setName('imagenurl')
        .setDescription('URL directa de la imagen')
        .setRequired(true)),
  async execute(interaction, client) {
    const imagenurl = interaction.options.getString('imagenurl');
    const extensiones = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensiones.some(ext => imagenurl.toLowerCase().endsWith(ext))) {
      return interaction.reply({ content: '❌ La URL no termina en un formato de imagen válido.', ephemeral: true });
    }

    try {
      await client.user.setAvatar(imagenurl);
      await interaction.reply({ content: '✅ Avatar actualizado desde la URL con éxito.', ephemeral: true });
    } catch (error) {
      console.error('❌ Error al cambiar el avatar:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Ocurrió un error al cambiar el avatar.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Ocurrió un error al cambiar el avatar.', ephemeral: true });
      }
    }
  }
};

