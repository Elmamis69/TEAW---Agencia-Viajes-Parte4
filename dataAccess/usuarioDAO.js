const mongoose = require('mongoose');
const Usuario = require('./../models/usuario');

class UsuarioDAO {
  async getAllUsuarios() {
    return await Usuario.find({});
  }

  async getUsuarioById(id) {
    return await Usuario.findById(id);
  }

  async getUsuarioByUsername(username) {
    return await Usuario.findOne({ nombreUsuario: username });
  }

  async createUsuario(usuarioData) {
    const usuario = new Usuario(usuarioData);
    return await usuario.save();
  }

  async updateUsuario(id, usuarioData) {
    return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
  }

  async deleteUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
  }
}

module.exports = UsuarioDAO;