const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3002;

// Database configuration
const db = new sqlite3.Database('data.db');

// Create 'text' table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS text (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
});

app.use(bodyParser.urlencoded({ extended: false }));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO text (name) VALUES (?)';
    db.run(sql, [name], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.send(`Name: ${name}`);
    });
});



// Route to fetch text by ID
app.get('/retrieve', (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT name FROM text WHERE id = ?'; // Select the 'name' column
    db.get(sql, [id], (err, row) => {
    
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            return res.status(404).send('Text not found');
        }
        res.send(`Text: ${row.name}`);
    });
});





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
