const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {validationResult, body } = require('express-validator');

router.post('/',[
    body('name', 'Plz enter atleast 3 characters ').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'plz enter password haning atleast 5 characters').isLength({min: 5})

], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).then(User=>res.json(User)).catch(err=>{console.log(err)
        res.json({error: 'plz enter a unique value'})});
    
})

module.exports = router