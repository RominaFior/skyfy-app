'use strict'
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
let User = require('../models/user');
var jwt = require('../services/jwt');


function saveUser(req, res) {

    var user = new User();
    var params = req.body;
    var email = params.email
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';


    if (params.password) {
        // encriptar contraseña al recibirla
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;

            if (user.name != null && user.surname != null && user.email != null) {

                // guardar datos en la BBDD
                user.save((err, userStored) => {

                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    }
                    else {

                        if (!userStored) {

                            res.status(404).send({ message: 'No se ha registrado el usuario' });

                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }

                });

            } else {

                res.status(200).send({ message: 'Rellena todos los campos' });

            }
        });

    } else {
        res.status(200).send({ message: 'introduce la contraseña' });
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if (!user) {
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                //comprobar contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //devolver los datos del usuario logueado 
                        if (params.gethash) {
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }                     
                    }else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    if (userId != req.user.sub) {
       return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    })
}

function uploadImage(req, res) {
    let userId = req.params.id;
    var file_name = 'Imagen no subida'; //nombre fichero

    if (req.files) { //variable superglobal file de connect mutiparty
        var file_path = req.files.image.path;
        var file_split= file_path.split('\\');
        var file_name = file_split[2]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]

      
        if (file_ext == 'png'|| file_ext == 'jpg'||file_ext == 'gif' ) {

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            });

        }else{
            res.status(200).send({message: 'Extensión del archivo no válida'});
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }
}

function getImageFile(req, res){
 
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    
    fs.access(path_file, fs.constants.F_OK, (err) => {
    if(!err){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({ message: 'No existe la imagen' });
    }
    
    }); 
   }

module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};