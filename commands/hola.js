const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Hola = require('../models/comandos_mongo/hola'); // ✅ ruta corregida

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hola')
    .setDescription('Saluda al usuario'),

  async execute(interaction) {
    // Guardamos el saludo en MongoDB
    const registro = new Hola({
      discordId: interaction.user.id,
      username: interaction.user.username
    });
    await registro.save();

    // Creamos el embed
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('👋 ¡Hola!')
      .setDescription(`Encantado de verte, **${interaction.user.username}**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'Comando hola', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    // Respondemos con el embed
    await interaction.reply({ embeds: [embed] });
  }
};
