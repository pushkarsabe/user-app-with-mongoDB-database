const mongoose = require('mongoose');
const Joi = require('joi');

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

const userValidationSchema = Joi.object({
    username: Joi.string().required(),
    age: Joi.number().integer().min(0).required()
});

module.exports = {
    User: mongoose.model("User", userSchema),
    userValidationSchema: userValidationSchema
}


