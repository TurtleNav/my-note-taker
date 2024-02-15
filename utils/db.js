const fs = require('fs');
const path = require('path');

const { getUUID } = require('./uuid');


// The absolute path to our database file. This avoids errors with the
// the relative path of both db.js and server.js to the database file
const dbPath = path.join(__dirname, '../db/db.json');

let prevSession = loadSavedNotes();
let notes = prevSession;
console.log('yo notes are -> ', notes);
// Set of all uuids generated for the current notes
let usedUuids = new Set(notes.map((note) => note.uuid));

const Note = function(title, text) {
    this.title = title,
    this.text = text,
    this.uuid = function(){
        let uuid;

        // If the max number of notes has been reached, replace
        // a randomly chosen note
        if (notes.length >= (2**16)) {
            console.error('Max note count has been reached');
            uuid = getUUID();
            deleteNote(uuid);
        } else {
            do {
                uuid = getUUID();
            } while (usedUuids.has(uuid));
        }
        usedUuids.add(uuid);
        return uuid;
    }();
}

function loadSavedNotes() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return data ? JSON.parse(data) : [];
    //return fs.readFileSync(dbPath, 'utf8', (err, data) => data ? JSON.parse(data) : []);
}

function saveNotes() {
    fs.writeFileSync(dbPath, JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
            console.error(err);
        } else {
            currentSession = [];
            prevSession = notes;
        }
    });
}

// Add a note to the global arrays. The note object is created from the
// title and text the user provided. An additional UUID is generated for
// identification purposes. If the generated UUID already belongs to a
// note then a new ones will be created until the UUID is guaranteed to be
// unique
function addNote(note) {
    notes.push(note);
}

function deleteNote(uuid) {
    let i = 0;
    do {
        if (notes[i].uuid === uuid) {
            console.log(`Deleting a note with a UUID matching: ${uuid}`);
            notes.splice(i,1);
            break;
        }
        if (i++ > notes.length) {
            console.log(`A note with a UUID matching ${uuid} was not found`);
            break;
        }
    } while (true);
}

// Three different handlers 
process.on('exit', (code) => saveNotes());
process.on('SIGINT', () => {
    console.log("\nReceived a SIGINT, program will save any cached notes and then exit\n");
    process.exit();
}); // Admin terminates server.js (most likely presses ctrl+C)
process.on('SIGTERM', () => saveNotes());

module.exports = {loadSavedNotes, saveNotes, addNote, deleteNote, notes, Note}
