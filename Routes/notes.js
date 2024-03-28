const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const Note = require('../models/Note')
var fetchuser = require('../middleware/fetchuser')

//Route1 : Getting all notes by Get localhost:5000/api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
    
        // Stringify the notes, handling circular references
        const jsonString = JSON.stringify(notes, function (key, value) {
            if (key === 'client') {
                return; // Ignore circular reference to client property
            }
            return value;
        });
    
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
})

//Route2 : Add notes by post localhost:5000/api/notes/addnote
router.post('/addnote', fetchuser, [
    body('title', 'Please enter at least 3 characters').isLength({ min: 3 }),
    body('description', 'Please enter atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    
    try {
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save()
        res.json(saveNote)


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router