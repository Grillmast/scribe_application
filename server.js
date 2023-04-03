const express = require("express");
const path = require('path');
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));

// Get all notes and send them back as JSON response
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

// Route handler for the root URL, sends the main HTML file 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

// Serve the index.html file when the client requests the "/notes route"
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Serve the index.html for any other route that is undefined
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Create a new note and add it to the database
 function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
    notesArray = [];
    
    if (notesArray.length === 0)
    notesArray = [];

    // Assign an ID to the new note
    body.id = notesArray[0];
    notesArray[0]++;
    
    // Add the new note to the array and write to the database
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
 }

// Handle POST requests to create a new note
 app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
 });

 // Delete a new note with a given ID from the database
 function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        // Find the note with the matching ID and remove it from the array
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
 }
 
// Handle DELETE requests to delete a note with a given ID
 app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
 });

app.listen(PORT, () => 
    console.log(`Server listening at http://localhost:${PORT}`)
);