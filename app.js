// Importa el framework Express para la creación de la aplicación web
const express = require('express');
const path = require('path'); // Proporciona utilidades para trabajar con rutas de archivos y directorios
const bodyParser = require('body-parser'); // Middleware para analizar el cuerpo de las solicitudes HTTP
const app = express(); // Crea una instancia de la aplicación Express

// Importa el módulo mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Importa el modelo de usuario definido en otro archivo
const User = require('./public/user');

// Configura la aplicación para usar el analizador de cuerpo JSON y URL codificada
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configura la aplicación para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// URI de conexión a la base de datos MongoDB
const mongo_uri = 'mongodb://localhost:27017/PruebaFinalFINAL';

// Conecta la aplicación a la base de datos MongoDB
mongoose.connect(mongo_uri)
    .then(() => {
        console.log(`Successfully connected to ${mongo_uri}`);
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

// Ruta para el registro de usuarios
app.post('/register', (req, res) => {
    // Obtiene los datos de usuario del cuerpo de la solicitud
    const { username, password, email } = req.body;

    // Crea una nueva instancia del modelo User con los datos proporcionados
    const user = new User({ username, password, email });

    // Guarda el usuario en la base de datos
    user.save()
        .then(() => {
            res.status(200).send('USUARIO REGISTRADO');
        })
        .catch(err => {
            res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
        });
});

// Ruta para la autenticación de usuarios
app.post('/authenticate', (req, res) => {
    // Obtiene el nombre de usuario y la contraseña del cuerpo de la solicitud
    const { username, password } = req.body;

    // Busca un usuario en la base de datos por su nombre de usuario
    User.findOne({ username })
        .then(user => {
            if (!user) {
                // Si el usuario no existe, devuelve un error
                res.status(500).send('USUARIO NO EXISTE');
            } else {
                // Verifica si la contraseña proporcionada coincide con la almacenada en la base de datos
                user.isCorrectPassword(password, (err, result) => {
                    if (err) {
                        res.status(500).send('ERROR AL AUTENTICAR');
                    } else if (result) {
                        res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
                    } else {
                        res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
        });
});

// Configura la aplicación para escuchar en el puerto 3000
app.listen(3000, () => {
    console.log('server started');
})

// Exporta la aplicación para ser utilizada en otros archivos (por ejemplo, en pruebas unitarias)
module.exports = app;
