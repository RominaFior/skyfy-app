'use strict'
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 5000


mongoose.connect('mongodb://localhost:27017/skylabfy', (err, res) =>{
    if (err) {
        throw err
    }else{
        console.log('La conexión a la base de datos está funcionando correctamente');
        app.listen(port, function(){
            console.log(`servidor del api rest de music escuchando en http://localhost:${port}`);
        })
    }
})