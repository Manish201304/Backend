const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

//Route1 : sending request to localhost:5000/api/auth/createUser
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
        const salt = await bcrypt.genSalt(10);
        const secure = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secure,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        //Genrating jwt tokens
        const authToken = jwt.sign(data, 'manishisabadboy');
        console.log(authToken);
        res.json({ authToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Route2 : sending request to localhost:5000/api/auth/login  for login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
        // Checking email exists or not
    let user =  await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "please enter with correct credentials" });
    }
    // Comapring password with DataBase
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        return res.status(400).json({ error: "please enter with correct credentials" });
    }

    const data = {
        user: {
            id: user.id
        }
    }
    //Genrating jwt tokens
    const authToken = jwt.sign(data, 'manishisabadboy');
    console.log(authToken);
    res.json({ authToken });
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

//Route3 : sending request to localhost:5000/api/auth/userdetails  for user details
router.post('/userdetails', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
    
})
module.exports = router;
