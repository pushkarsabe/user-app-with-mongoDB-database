const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Users", userSchema);


