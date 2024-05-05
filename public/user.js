// Importa el módulo mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Importa el módulo bcrypt para el cifrado de contraseñas
const bcrypt = require('bcrypt');

// Define el número de rondas de sal para el cifrado de contraseñas
const saltRounds = 10;

// Define el esquema de datos para el usuario usando mongoose.Schema
const UserSchema = new mongoose.Schema({
    // Campo para el nombre de usuario, debe ser una cadena de texto, requerido y único
    username: { type: String, required: true, unique: true },
    // Campo para la contraseña, debe ser una cadena de texto, requerido
    password: { type: String, required: true },
    // Campo para el correo electrónico, debe ser una cadena de texto, requerido y único
    email: { type: String, required: true, unique: true }
});

// Middleware ejecutado antes de guardar un usuario en la base de datos
UserSchema.pre('save', function (next) {
    // Verifica si es un nuevo usuario o si la contraseña ha sido modificada
    if (this.isNew || this.isModified('password')) {
        const document = this;
        // Genera el hash de la contraseña utilizando bcrypt
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                // Pasa el error al siguiente middleware
                next(err);
            } else {
                // Actualiza la contraseña del usuario con el hash generado
                document.password = hashedPassword;
                // Continúa con el siguiente middleware
                next();
            }
        });
    } else {
        // Si la contraseña no ha sido modificada, pasa al siguiente middleware
        next();
    }
});

// Método para verificar si una contraseña es correcta
UserSchema.methods.isCorrectPassword = function (candidatePassword, callback) {
    // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
    bcrypt.compare(candidatePassword, this.password, function (err, same) {
        if (err) {
            // Si hay un error, llama al callback con el error
            callback(err);
        } else {
            // Si no hay error, llama al callback con el resultado de la comparación
            callback(err, same);
        }
    });
}

// Exporta el modelo de usuario basado en el esquema definido
module.exports = mongoose.model('User', UserSchema);
