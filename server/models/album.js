const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let AlbumSchema = Schema({
    title: {
        type: String      
    },
    description: {
        type: String        
    },
    year: {
        type: Number
    },   
    image: {
        type: String
    },
    artist: {
        type: Schema.ObjectId,
        ref: "Artist"
    }
    
});

module.exports = mongoose.model('Album', AlbumSchema);
