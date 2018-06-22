const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = Schema({
    name: {
        type: String,        
    },
    surname: {
        type: String,        
    },
    email: {
        type: String,  
       
    },
    password: {
        type: String,
       
    },
    role: {
        type: String
    },
    image: {
        type: String
    }
    
});
module.exports = mongoose.model('User', UserSchema);