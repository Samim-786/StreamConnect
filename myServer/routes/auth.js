const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const Router = express.Router();

// Signup
Router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existUser = await UserModel.findOne({ email });
        if (existUser) return res.status(400).json({ msg: 'User already exists' });

        const hashPass = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashPass });

        await user.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
});

// Signin
Router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

module.exports = Router;
