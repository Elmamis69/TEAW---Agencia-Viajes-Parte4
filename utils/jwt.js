const jwt = require('jsonwebtoken');
require('dotenv').config({path:'./variables.env'})
const secretKey = process.env.JWT_KEY;


// Función para generar un JWT
const generateToken=(user)=> {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
}

// Middleware para verificar el JWT
const verifyToken =(req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado: Token no proporcionado' });
  }


  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Acceso denegado: Token no válido' });
    }
    req.user = user;
    next();
  });
}

// Middleware para verificar el usuario del JWT
const verifyTokenUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Acceso denegado: Token no válido' });
    }
    
    // Verificar que el ID del usuario en el JWT coincida con el ID proporcionado en la solicitud
    if (user.id !== req.params.id) {
      return res.status(403).json({ error: 'Acceso denegado: El ID del usuario en el token no coincide con el ID proporcionado' });
    }

    req.user = user;
    next();
  });
}



module.exports={
  generateToken,
  verifyToken,
  verifyTokenUser
}