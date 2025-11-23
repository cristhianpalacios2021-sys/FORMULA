// verificar_comandos.js
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

// MongoDB modelo
const Comando = require('./models/comandos_mongo/Comando.js');

// Leer comandos desde carpeta
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const comandosRegistrables = [];
const errores = [];

console.log(chalk.yellow('🔍 Verificando comandos slash...'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const comando = require(filePath);
    if (!comando?.data || typeof comando.execute !== 'function') {
      errores.push(`❌ ${file} no tiene estructura válida (falta .data o .execute)`);
      continue;
    }
    comandosRegistrables.push(comando.data.toJSON());
    console.log(chalk.green(`✅ ${comando.data.name} cargado correctamente`));
  } catch (err) {
    errores.push(`❌ Error al cargar ${file}: ${err.message}`);
  }
}

// Mostrar errores de estructura
if (errores.length > 0) {
  console.log(chalk.red('\n⚠️ Errores encontrados:'));
  errores.forEach(e => console.log(chalk.red(e)));
} else {
  console.log(chalk.green('\n✅ Todos los comandos tienen estructura válida'));
}

// Verificar estado en MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(chalk.cyan('\n🔗 Conectado a MongoDB'));

    for (const file of commandFiles) {
      const comando = require(path.join(commandsPath, file));
      const nombre = comando.data.name;
      const doc = await Comando.findOne({ cmd: nombre });

      if (!doc) {
        console.log(chalk.yellow(`⚠️ ${nombre} no está registrado en MongoDB`));
      } else if (!doc.activo) {
        console.log(chalk.red(`⛔ ${nombre} está desactivado en MongoDB`));
      } else {
        console.log(chalk.green(`📦 ${nombre} activo en MongoDB`));
      }
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error(chalk.red('❌ Error al conectar a MongoDB:'), err.message);
  });

// Intentar registrar en Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(chalk.blue('\n🔄 Registrando comandos en Discord...'));
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: comandosRegistrables }
    );
    console.log(chalk.green(`✅ ${comandosRegistrables.length} comandos registrados en Discord`));
  } catch (error) {
    console.error(chalk.red('❌ Error al registrar comandos en Discord:'), error.message);
  }
})();
