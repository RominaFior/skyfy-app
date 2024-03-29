'use strict'
const express = require('express');
const UserController = require('../controllers/user');


let api = express.Router();
let md_auth = require('../middlewares/authenticated');
let multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'})


api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile',  UserController.getImageFile);

module.exports = api;