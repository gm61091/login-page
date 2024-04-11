const express = require('express');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');

const PORT = 3000;
const saltRounds = 8;
const userTypedInPassword = 'mypassword';
let storedPassword = '';

// Hash the user password
bcrypt.hash(userTypedInPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    storedPassword = hash;
    console.log(`Hashed password: ${hash}`);
});

// Compare hashed password with user input
bcrypt.compare(userTypedInPassword, storedPassword, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    if (result) {
        console.log('Passwords match');
    } else {
        console.log("Passwords don't match");
    }
});

const app = express();
app.use(express.json());

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Route to serve an HTML file
app.get('/connected', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

