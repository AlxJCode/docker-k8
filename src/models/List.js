const { Schema, model } = require('mongoose');

const listSchema = new Schema({
    name: {
        type: String,
        unique: true
    }
});

module.exports = model('List', listSchema);