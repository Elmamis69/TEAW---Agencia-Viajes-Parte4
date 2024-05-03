const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { conectar } = require('./config/db'); // Importar la función conectar del archivo db.js
const usuarioroutes = require('./routes/usuarioroutes');
const UsuarioController = require('./controllers/usuarioController');

const app = express();

// Configurar Express para servir archivos estáticos desde la carpeta 'registrar'
app.use('/registrar', express.static(path.join(__dirname, 'registrar')));

// Middleware para analizar datos de solicitud codificados en json
app.use(bodyParser.json());

// Middleware para analizar datos de formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas para usuarios
app.use('/usuario', usuarioroutes);

// Ruta para registrar usuario
app.post('/usuario/registrar', UsuarioController.crearUsuario);

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos al iniciar el servidor
conectar()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    // Iniciar el servidor una vez que se haya establecido la conexión a la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error de conexión a la base de datos:', error);
    // En caso de error de conexión, no iniciamos el servidor
  });

// Manejar la desconexión de la base de datos al cerrar el servidor
process.on('SIGINT', async () => {
  try {
    await desconectar();
    console.log('Desconexión exitosa de la base de datos');
    process.exit(0);
  } catch (error) {
    console.error('Error al desconectar la base de datos:', error);
    process.exit(1);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registrar', 'registrar.html'));
});
