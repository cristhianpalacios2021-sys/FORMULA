const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('estado')
    .setDescription('Muestra el estado de todos los comandos slash'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const lista = interaction.client.commands.map(cmd => {
      const estado = cmd.activo === false ? '❌ Desactivado' : '✅ Activo';
      return `• \`${cmd.data.name}\`: ${estado}`;
    });

    await interaction.editReply({
      content: `📋 Estado de comandos:\n${lista.join('\n')}`
    });
  },

  activo: true
};
