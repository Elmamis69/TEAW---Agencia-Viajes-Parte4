const mongoose = require('mongoose')
require('dotenv').config({path:'./variables.env'})
 
const config={
    url:process.env.URL_MONGO,
    options:{}
}

async function conectar(){
    return await mongoose.connect(config.url,config.options)
}

async function desconectar(){
    return mongoose.disconnect();
}

module.exports= {conectar,desconectar}