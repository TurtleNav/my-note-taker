const path = require('path');
const express = require('express');
const db = require('./utils/db');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  // Send a message to the client

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
  const data = db.loadSavedNotes();
  //console.log('data -> ', data)
  res.json(data);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to notes`);

  const {title, text} = req.body;
  if (title && text) {
    const newNote = new db.Note(title, text);
    db.addNote(newNote);

    res.status(201).json(newNote);
  } else {
    res.status(500).json('Error in saving note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Got a delete request for note id: ${id}`)
  db.deleteNote(id);
  res.status(200).json({uuid: id});

});

// Added the below wildcard route to redirect to the mainpage upon visiting
// any page besides the notes page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
