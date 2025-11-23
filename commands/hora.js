const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const tzlookup = require('tz-lookup');
const moment = require('moment-timezone');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hora')
    .setDescription('Muestra la hora actual en una ciudad del mundo')
    .addStringOption(option =>
      option.setName('ciudad')
        .setDescription('Nombre de la ciudad, capital, cantón o región')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ciudad = interaction.options.getString('ciudad');
    const apiKey = process.env.WEATHER_API;

    try {
      // 🔍 Buscar ciudad en Weather_Api Geocoding
      const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: ciudad,
          limit: 1,
          appid: apiKey
        }
      });

      const datos = geoRes.data[0];
      if (!datos) {
        return interaction.reply({
          content: `❌ No se encontró la ciudad "${ciudad}". Intenta con otra o verifica la ortografía.`,
          ephemeral: true
        });
      }

      const { lat, lon, name, country, state } = datos;
      const zona = tzlookup(lat, lon);
      const hora = moment().tz(zona).format('HH:mm:ss');
      const fecha = moment().tz(zona).format('YYYY-MM-DD');

      // 🎨 Embed con la información
      const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle(`🕒 Hora actual en ${name}${state ? ', ' + state : ''}, ${country}`)
        .addFields(
          { name: '⏰ Hora', value: hora, inline: true },
          { name: '📅 Fecha', value: fecha, inline: true },
          { name: '🌐 Zona horaria', value: zona, inline: false }
        )
        .setFooter({ text: 'Comando hora', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error al obtener la hora:', error);
      await interaction.reply({
        content: '❌ Ocurrió un error al consultar la hora. Intenta nuevamente más tarde.',
        ephemeral: true
      });
    }
  }
};
