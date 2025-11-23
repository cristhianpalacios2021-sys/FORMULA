// commands/puntos.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User'); // Importamos el modelo (asegúrate que el archivo sea User.js o user.js según tu caso)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('puntos')
    .setDescription('Muestra tus puntos actuales'),

  async execute(interaction) {
    try {
      // Buscar usuario en MongoDB
      let user = await User.findOne({ discordId: interaction.user.id });

      // Si no existe, lo creamos con puntos = 0
      if (!user) {
        user = new User({
          discordId: interaction.user.id,
          puntos: 0
        });
        await user.save();
      }

      // Creamos un embed para mostrar los puntos
      const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle(`🎯 Puntos de ${interaction.user.username}`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: 'Total de puntos', value: `${user.puntos}`, inline: true }
        )
        .setFooter({ text: 'Sistema de puntos', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      // Respondemos con el embed
      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error en el comando /puntos:', error);
      await interaction.reply({ content: '❌ Hubo un error al consultar tus puntos.', ephemeral: true });
    }
  }
};
