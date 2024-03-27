const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { validationResult, body } = require('express-validator');

//sending request to localhost:5000/api/auth/createUser
router.post('/createUser', [
    body('name', 'Please enter at least 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Please enter a password containing at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // checking whether this email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }
        //Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
