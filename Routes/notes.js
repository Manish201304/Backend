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

//Route3 : Add notes by put localhost:5000/api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
    const {title, description, tag} = req.body;
    // created a newNote object
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //find the note that to be updated and upadate it
     let note = await Note.findById(req.params.id)
     if(!note){return res.status(404).send("Not Found")};

     if(note.user.toString()!==req.user.id){return res.status(401).send("Not allowed")};
     note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
     res.json(note);
     
     
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//Route3 : Add notes by DELETE localhost:5000/api/notes/deletenote
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
     //find the note that to be delete and delete it
     let note = await Note.findById(req.params.id)
     if(!note){return res.status(404).send("Not Found")};

     if(note.user.toString()!==req.user.id){return res.status(401).send("Not allowed")};
     note = await Note.findByIdAndDelete(req.params.id);
     res.json({ "Success": "Note has deleted " ,note: note});
    }
     catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router