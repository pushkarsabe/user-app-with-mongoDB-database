const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = mongoose.Schema({
    username: {
        type: string,
        required: true
    },
    age: {
        type: number,
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


