const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');
const Comando = require('./models/comandos_mongo/Comando.js');
const path = require("node:path");
const fs = require("node:fs");
require('dotenv').config();
const axios = require('axios');
const { REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/// 3. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green('✅ MongoDB conectado correctamente')))
  .catch((error) => console.log(chalk.red(`❌ Error al conectar a MongoDB: ${error}`)));

  // models/User.js
const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  puntos: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);

// commands/puntos.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('puntos')
    .setDescription('Muestra tus puntos actuales'),
  async execute(interaction) {
    let user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      user = new User({ discordId: interaction.user.id, puntos: 0 });
      await user.save();
    }
    await interaction.reply(`🎯 ${interaction.user.username}, tienes ${user.puntos} puntos.`);
  },
};

// 4. Evento: Bot listo
client.on('ready', () => {
  console.log(chalk.green(`✅ Bot conectado como ${client.user.tag}`));
});

// 5. Cargar comandos slash desde carpeta
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const comandosRegistrables = [];
const slashMap = new Map();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const comando = require(filePath);
  if (comando?.data) {
    comandosRegistrables.push(comando.data.toJSON());
    slashMap.set(comando.data.name, comando);
  }
}

// Guardar el mapa en el cliente
client.slashMap = slashMap;

// 6. Registrar comandos en Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(chalk.yellow('🔄 Registrando comandos slash en Discord...'));
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: comandosRegistrables }
    );
    console.log(chalk.green(`✅ ${comandosRegistrables.length} comandos slash registrados correctamente`));
  } catch (error) {
    console.error(chalk.red('❌ Error al registrar comandos slash:'), error);
  }
})();

// 7. Manejador de slash commands
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const comando = client.slashMap.get(interaction.commandName);
  if (!comando) {
    return interaction.reply({ content: `❌ Comando no encontrado`, flags: 64 });
  }

    try {
      await comando.execute(interaction);
    } catch (error) {
      console.error(`❌ Error ejecutando ${interaction.commandName}:`, error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "❌ Error al ejecutar el comando.", flags: 64 });
      } else {
        await interaction.followUp({ content: "❌ Error al ejecutar el comando.", flags: 64 });
      }
    }
  });
  
  // 8. Manejador de comandos de texto predefinidos
  client.on("messageCreate", async message => {
    if (message.author.bot) return;
    
    const contenido = message.content.toLowerCase();
    
  // Comandos predefinidos
  if (contenido === '!hola') {
    return message.reply('¡Hola!');
  }

  if (contenido === '!eres un animal') {
    await message.reply('¡Claro que sí! Soy un bot muy animal 🦁🐯🐻');
    const animales = [
      'https://i.etsystatic.com/6721058/r/il/26eea2/4916474361/il_600x600.4916474361_jjde.jpg'
    ];
    const randomAnimal = animales[Math.floor(Math.random() * animales.length)];
    return message.reply(randomAnimal);
  }

  if (contenido === '!fecha') {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return message.reply(`📅 Hoy es: ${fecha}`);
  }

  if (contenido.startsWith('clima')) {
    const ciudad = contenido.split(' ')[1] || 'Quito';
    const apikey = process.env.WEATHER_API;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apikey}&units=metric&lang=es`;
    try {
      const res = await axios.get(url);
      const clima = res.data;
      const desc = clima.weather[0].description;
      const temp = clima.main.temp;
      return message.reply(`🌤 Clima en ${ciudad}: ${desc}, ${temp}°C`);
    } catch (err) {
      console.error('❌ Error consultando clima:', err);
      return message.reply('❌ No pude obtener el clima. ¿La ciudad está bien escrita?');
    }
  }

  if (contenido === '!feriado') {
    return message.reply('🎉 El próximo feriado en Ecuador es **Día de la Independencia de Guayaquil**, el 9 de octubre.');
  }

  if (contenido === '!historia') {
    return message.reply('📖 ¿Sabías que el primer grito de independencia de Ecuador fue el **10 de agosto de 1809** en Quito? Fue uno de los primeros movimientos libertarios de América Latina.');
  }

  if (contenido === '!ayuda') {
    return message.reply(`📌 Comandos disponibles:
- !hola
- !eres un animal
- !hora
- !fecha
- !clima [ciudad]
- !feriado
- !historia`);
  }
});

// Manejador de comandos slash
process.on('unhandledRejection', err => {
  console.error('❌ Error no capturado:', err);
});

// Iniciar sesión del bot
client.login(process.env.TOKEN);