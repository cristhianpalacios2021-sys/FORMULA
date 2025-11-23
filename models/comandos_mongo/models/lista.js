// commands/lista.js
const { SlashCommandBuilder } = require('discord.js');
const Persona = require('../models/comandos_mongo/Persona');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lista')
    .setDescription('Muestra todas las personas registradas en la base de datos'),
  async execute(interaction) {
    try {
      const personas = await Persona.find();

      if (personas.length === 0) {
        return interaction.reply('❌ No hay personas registradas todavía.');
      }

      // Construimos la lista en texto
      const lista = personas
        .map(p => `👤 ${p.nombre} (${p.edad} años, ${p.ciudad})`)
        .join('\n');

      await interaction.reply(`📋 Personas registradas:\n${lista}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Hubo un error al consultar la lista.');
    }
  },
};

