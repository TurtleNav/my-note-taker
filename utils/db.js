const fs = require('fs');
const path = require('path');

const { getUUID } = require('./uuid');


// The absolute path to our database file. This avoids errors with the
// the relative path of both db.js and server.js to the database file
const dbPath = path.join(__dirname, '../db/db.json');

// Set of all uuids generated for the current notes
let usedUuids = new Set(loadSavedNotes().map((note) => note.uuid));

const Note = function(title, text) {
    this.title = title,
    this.text = text,
    this.uuid = function(){
        let uuid;
        do {
            uuid = getUUID();
        } while (usedUuids.has(uuid));
        usedUuids.add(uuid);
        return uuid;
    }();
}

function addNote(note) {
    const notes = loadSavedNotes();
    notes.push(note);
    saveNotes(notes);
}

function loadSavedNotes() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return data ? JSON.parse(data) : [];
}

function saveNotes(notes) {
    fs.writeFileSync(dbPath, JSON.stringify(notes), 'utf8', (err) => {
        err ? console.error(err) : ''
    });
}

function deleteNote(uuid) {
    let notes = loadSavedNotes();
    // filter out the given uuid
    notes = notes.filter((note) => note.uuid !== uuid);
    saveNotes(notes);
}

// Three different handlers 
process.on('exit', (code) => saveNotes());
process.on('SIGINT', () => {
    console.log("\nReceived a SIGINT, program will save any cached notes and then exit\n");
    process.exit();
}); // Admin terminates server.js (most likely presses ctrl+C)
process.on('SIGTERM', () => saveNotes());

module.exports = {addNote, loadSavedNotes, saveNotes, deleteNote, Note}
