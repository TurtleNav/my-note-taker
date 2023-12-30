const fs = require('fs');
const express = require('express');
const path = require('path');
const crypto = require('crypto');

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
  //res.json(`${req.method} request received to get reviews`);

  // Log our request to the terminal
  console.info(`${req.method} request received to get reviews`);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    const reviews = JSON.parse(data);
    res.json(reviews);
  })

  console.log(crypto.randomBytes(4).toString('hex'));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get reviews`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const reviews = JSON.parse(data);
        res.json(reviews);
    })


});


// Added the below wildcard route to redirect to the mainpage upon visiting
// any page besides the notes page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
