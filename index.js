require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Saludo
  if (content === '¡hola') {
    message.reply('¡HOLA, CRISTHIAN!');
  }

  // Hora actual
  if (content === '!hora') {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    message.reply(`🕒 La hora actual es: ${hora}`);
  }

  // Animal
  if (content === '!eres un animal') {
    message.reply('¡Claro que sí! Soy un bot muy animal 🦁🐯🐻');

  }
  // Fecha actual
  if (content === '!fecha') {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    message.reply(`📅 Hoy es: ${fecha}`);
  }

  // Clima global
  if (content.startsWith('!clima')) {
    const ciudad = content.split(' ')[1] || 'Quito';
    const apiKey = process.env.WEATHER_API;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
      const res = await axios.get(url);
      const clima = res.data;
      const desc = clima.weather[0].description;
      const temp = clima.main.temp;
      message.reply(`🌤️ Clima en ${ciudad}: ${desc}, ${temp}°C`);
    } catch (err) {
      message.reply('❌ No pude obtener el clima. ¿La ciudad está bien escrita?');
    }
  }

  // Próximo feriado en Ecuador
  if (content === '!feriado') {
    message.reply('🎉 El próximo feriado en Ecuador es **Día de la Independencia de Guayaquil**, el 9 de octubre.');
  }

  // Dato histórico
  if (content === '!historia') {
    message.reply('📖 ¿Sabías que el primer grito de independencia de Ecuador fue el **10 de agosto de 1809** en Quito? Fue uno de los primeros movimientos libertarios de América Latina.');
  }

  // Ayuda
  if (content === '!ayuda') {
    message.reply(`📌 Comandos disponibles:
- ¡hola
- !eres un animal
- !hora
- !fecha
- !clima [ciudad]
- !feriado
- !historia`);
  }
});

client.login(process.env.TOKEN);
