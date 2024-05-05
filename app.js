const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./public/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb://localhost:27017/todos';

mongoose.connect(mongo_uri)
    .then(() => {
        console.log(`Successfully connected to ${mongo_uri}`);
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password });

    user.save()
        .then(() => {
            res.status(200).send('USUARIO REGISTRADO');
        })
        .catch(err => {
            res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
        });
});


app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.status(500).send('USUARIO NO EXISTE');
            } else {
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


app.listen(3000, () => {
    console.log('server started');
})

module.exports = app;
