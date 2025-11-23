const mongoose = require('mongoose');

const comandoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  respuesta: { type: String, required: true },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('comando', comandoSchema);

