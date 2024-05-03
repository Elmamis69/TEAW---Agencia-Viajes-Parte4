const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasenia: {
    type: String,
    required: true
  },
  info: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
