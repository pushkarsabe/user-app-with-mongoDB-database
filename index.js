const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/user');

const app = express();
const port = 4000;
const host = '127.0.0.1';
const mongoURL = 'mongodb://127.0.0.1:27017/DemoDBUsers'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try {
    mongoose.connect(mongoURL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log('MongoDB connection error:', err));
}
catch (err) {
    console.log(`error while connecting to mongodb${err}`);
}

app.get('/', (req, res) => {
    return res.json({ 'message': "started working and hi for this" });
})

app.get('/getData', async (req, res) => {
    let userData = await User.find();
    console.log('getData userData = ', userData);

    if (!userData) {
        return res.status(400).json({ 'message': "no data found" });
    }

    return res.json({ userData: userData });
});

app.get('/getSingleUsers/:userid', async (req, res) => {
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
        'message': "user found with userid",
        userData: userData
    });
});

app.post('/sendData', async (req, res) => {
    let username = req.body.username;
    let age = req.body.age;
    console.log('sendData username = ', username, ' age  = ', age);

    if (!age && !username) {
        return res.status(400).json({ 'message': "username and age both values are needed" });
    }

    let newUser = new User({
        username: username,
        age: age
    });
    await newUser.save();

    return res.status(200).json({ newUser: newUser });
});

app.put('/updateData/:userid', async (req, res) => {
    let userid = req.params.userid;
    let username = req.body.username;
    console.log('updateData userid = ', userid, ' username  = ', username);

    if (!userid) {
        return res.status(400).json({ 'message': "userid is needed" });
    }
    if (!username) {
        return res.status(400).json({ 'message': "username is needed" });
    }

    let userData = await User.findOne({ _id: userid });

    if (!userData) {
        return res.status(400).json({ 'message': "user not found with provided userid" });
    }
    userData.username = username;
    await userData.save();

    return res.status(200).json({
        'message': "user updated successfully",
        'updatedUser': userData
    });
});

app.delete('/deleteData/:userid', async (req, res) => {
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
});

try {
    app.listen(4000, host, () => {
        console.log(`server started running at ${port}`);
    })
}
catch (err) {
    console.log(`error while starting server${err}`);
}


