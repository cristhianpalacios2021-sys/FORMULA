const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('animal')
    .setDescription('Muestra un animal aleatorio'),
  async execute(interaction) {
    const animals = [
      'https://i.etsystatic.com/6721058/r/il/26eea2/4916474361/il_600x600.4916474361_jjde.jpg',
      'https://i.etsystatic.com/6721058/r/il/26eea2/4916474361/il_600x600.4916474361_jjde.jpg' // Puedes agregar más
    ];

    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    const embed = new EmbedBuilder()
      .setTitle('🐾 Animal aleatorio')
      .setImage(randomAnimal)
      .setColor(0x00AE86);

    await interaction.reply({ embeds: [embed] });
    },
    activo: true
  };
