const express = require('express');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const PORT = 3000;
const saltRounds = 8;

const userTypedInPassword = 'mypassword';
const storedPassword = '';

bcrypt.hash(userTypedInPassword, saltRounds, (err, hash) => {
    if (err) {
        console.log(err);
        return err
    }
    console.log('hashed password: ${hash}, user password: ${userTypedInPassword}');
});

bcrypt.compare(userTypedInPassword, storedPassword, (err, result) => {
    if (err) {
        console.log(err);
        return
    }
    if (result) {
        console.log('Passwords are a match');
    }
    else{
        console.log("passwords don't match");
    }
});


const app = express();
app.use(express.json());

const db = pgp('postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        // Store the user data in the database
        const newUser = await db.one(`
            INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id`, [req.body.name, req.body.email, hashedPassword]);
        res.send(`User registered with ID: ${newUser.id}`);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', async (req, res) => {
    try {
        // Find the user by email in the database
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', req.body.email);
        if (user) {
            // Compare hashed password with user input
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Error authenticating user');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`);
});





// const express = require(express);
// const pgp = require(pg-promise)();
// const db = pgp(postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn);
// const PORT = 3000;
// const bcrypt = require('bcrypt')

// const userTypedInPassword = 'mypassword';
// const saltRounds = 8;
// let storedPassword = ''

// bcrypt.hash(userTypedInPassword, saltRounds, (err, hash) => {
//     if (err) {
//         console.log(err);
//         return err
//     }
//     console.log(hashed password: ${hash}, user password: ${userTypedInPassword});
// })


// bcrypt.compare(userTypedInPassword, storedPassword, (err, result) => {
//     if (err) {
//         console.log(err);
//         return
//     }
//     if (result) {
//         console.log('Passwords are a match');
//     }
//     else{
//         console.log("passwords don't match");
//     }
// })


// const app = express();
// app.use(express.json());
// app.use(express.static(client))

// app.get('/connected', (req, res) => {
//     res.sendFile(__dirname + '/client/index.html')
// })