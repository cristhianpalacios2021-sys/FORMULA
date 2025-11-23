// models/comandos_mongo/Hola.js
const mongoose = require('mongoose');

const holaSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hola', holaSchema);
