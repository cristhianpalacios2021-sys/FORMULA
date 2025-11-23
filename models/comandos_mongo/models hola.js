const Comando = require('../models/Comando_mongo');

module.exports = {
  nombre: "hola",
  async ejecutar(message) {
    try {
      const comando = await Comando.findOne({ nombre: "hola", activo: true });

      const mencionado = message.mentions.users.first();
      if (!mencionado) {
        return message.reply("❌ Debes mencionar a alguien para saludar.");
      }

      if (comando) {
        message.reply(`¡${comando.respuesta} ${mencionado.username}!`);
      } else {
        message.reply("❌ Comando 'hola' no está activo en MongoDB.");
      }
    } catch (error) {
      console.error("Error al ejecutar 'hola':", error);
      message.reply("⚠️ Hubo un error al consultar MongoDB.");
    }
  }
};
