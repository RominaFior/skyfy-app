const mongoose = require('mongoose');
const Schema = mongoose.Schema;



let ArtistSchema = Schema({
    name: {
        type: String,
       
    },
    description: {
        type: String,
        
    },   
    image: {
        type: String
    }
    
});
module.exports = mongoose.model('Artist', ArtistSchema)