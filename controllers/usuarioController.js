const UsuarioDAO = require('../dataAccess/usuarioDAO');
const jwtUtils = require('../utils/jwt');
const { AppError } = require('../utils/appError');

class UsuarioController {
  static async autenticarUsuario(req, res, next) {
    try {
      const { correo, contrasenia } = req.body;
      const usuario = await UsuarioDAO.getUsuarioByUsername(correo);

      if (!usuario || usuario.contrasenia !== contrasenia) {
        return next(new AppError('Correo o contraseña incorrectos', 401));
      }

      const userData = { id: usuario._id, correo: usuario.correo };
      const token = jwtUtils.generateToken(userData);
      res.json({ token });
    } catch (error) {
      next(new AppError('Error al autenticar usuario', 500));
    }
  }

  static async crearUsuario(req, res, next) {
    try {
      const { nombreUsuario, correo, contrasenia } = req.body;
      const usuarioData = { nombreUsuario, correo, contrasenia };
      const usuario = await UsuarioDAO.createUsuario(usuarioData);
      res.status(201).json(usuario);
    } catch (error) {
      next(new AppError('Error al crear usuario', 500));
    }
  }

  static async obtenerUsuarioPorId(req, res, next) {
    try {
      const usuario = await UsuarioDAO.getUsuarioById(req.params.id);
      if (!usuario) {
        return next(new AppError('Usuario no encontrado', 404));
      }
      res.status(200).json(usuario);
    } catch (error) {
      next(new AppError('Error al obtener usuario', 500));
    }
  }

  static async obtenerUsuarioPorNombre(req, res, next) {
    try {
      const usuario = await UsuarioDAO.getUsuarioByUsername(req.params.nombreUsuario);
      if (!usuario) {
        return next(new AppError('Usuario no encontrado', 404));
      }
      res.status(200).json(usuario);
    } catch (error) {
      next(new AppError('Error al obtener usuario', 500));
    }
  }

  static async obtenerUsuarios(req, res, next) {
    try {
      const usuarios = await UsuarioDAO.getAllUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      next(new AppError('Error al obtener usuarios', 500));
    }
  }

  static async actualizarUsuario(req, res, next) {
    try {
      const { id } = req.params;
      const usuarioData = req.body;
      const usuarioActualizado = await UsuarioDAO.updateUsuario(id, usuarioData);
      res.status(200).json(usuarioActualizado);
    } catch (error) {
      next(new AppError('Error al actualizar usuario', 500));
    }
  }

  static async eliminarUsuario(req, res, next) {
    try {
      const { id } = req.params;
      await UsuarioDAO.deleteUsuario(id);
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(new AppError('Error al eliminar usuario', 500));
    }
  }
}

module.exports = UsuarioController;
