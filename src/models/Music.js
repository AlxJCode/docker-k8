const { Schema, model } = require('mongoose');

const musicSchema = new Schema({
    name: String,
    idYoutube: String,
    image: String,
    reproductions: Number,
    lists: [String],
    favourite: { type:Boolean, default:false},

});

module.exports = model('Music', musicSchema);