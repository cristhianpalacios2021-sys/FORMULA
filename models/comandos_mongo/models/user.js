// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  puntos: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
