const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let SongSchema = Schema({
    number: {
        type: Number
    },
    name: {
        type: String,
        
    },
    duration: {
        type: String,
        
    },
    file: {
        type: String
    },  
           
    album : {
        type: Schema.ObjectId, 
        ref: 'Album'
    }
    
});

module.exports = mongoose.model('Song', SongSchema)