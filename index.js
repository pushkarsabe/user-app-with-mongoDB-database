const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { User, userValidationSchema } = require('./model/user');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try {
    mongoose.connect(process.env.MONGODBURL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log('MongoDB connection error:', err));
}
catch (err) {
    console.log(`error while connecting to mongodb${err}`);
}

app.get('/api/getData', async (req, res) => {
    try {
        let userData = await User.find();
        console.log('getData userData = ', userData);

        if (!userData) {
            return res.status(400).json({ 'message': "no data found" });
        }

        return res.json({ userData: userData });
    }
    catch (err) {
        return res.status(500).json({ 'message': `An error occurred while fetching all users: ${err.message}` });
    }
});

app.get('/api/getSingleUsers/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        console.log('getSingleUsers userid = ', userid);

        if (!userid) {
            return res.status(400).json({ 'message': "userid is needed" });
        }
        let userData = await User.findById(userid);

        if (!userData) {
            return res.status(400).json({ 'message': "user not found with provided userid" });
        }

        return res.status(200).json({
            'message': "User found successfully.",
            userData: userData
        })
    } catch (err) {

        return res.status(500).json({ 'message': `An error occurred while fetching the user: ${err.message}` });
    }

});

app.post('/api/sendData', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 'message': error.details[0].message });
    }
    try {
        let username = req.body.username;
        let age = req.body.age;
        console.log('sendData username = ', username, ' age  = ', age);

        let newUser = new User({
            username: username,
            age: age
        });
        await newUser.save();

        return res.status(201).json({ 'message': 'New user created successfully.', newUser: newUser });
    } catch (err) {

        return res.status(500).json({ 'message': `An error occurred while creating a new user: ${err.message}` });
    }
});

app.put('/api/updateData/:userid', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 'message': error.details[0].message });
    }
    try {
        let userid = req.params.userid;
        let username = req.body.username;
        let age = req.body.age;
        console.log('updateData userid = ', userid, ' username  = ', username, " age = ", age);

        if (!userid) {
            return res.status(400).json({ 'message': "userid is needed" });
        }

        let userData = await User.findOne({ _id: userid });

        if (!userData) {
            return res.status(400).json({ 'message': "user not found with provided userid" });
        }
        userData.username = username;
        userData.age = age;
        await userData.save();

        return res.status(200).json({
            'message': "user updated successfully",
            'updatedUser': userData
        });
    } catch (err) {

        return res.status(500).json({ 'message': `An error occurred while updating the user: ${err.message}` });
    }
});

app.delete('/api/deleteData/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        console.log('deleteData userid = ', userid);

        if (!userid) {
            return res.status(400).json({ 'message': "userid is needed for deleting data" });
        }

        let singleUserData = await User.findOneAndDelete({ _id: userid });
        console.log('singleUserData = ', singleUserData);

        if (!singleUserData) {
            return res.status(400).json({ 'message': "user not found with provided userid" });
        }

        return res.status(200).json({
            'message': "user deleted successfully",
            'deletedUser': singleUserData
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ 'message': 'Invalid user ID format provided for deletion.' });
        }
        return res.status(500).json({ 'message': `An error occurred while deleting the user: ${err.message}` });
    }
});

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server started and running at http://${HOST}:${PORT}`);
})
    .on('error', (err) => {
        console.error(`Error while starting the server: ${err.message}`);
    }); 
