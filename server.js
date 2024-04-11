const express = require(`express`);
const pgp = require(`pg-promise`)();
const db = pgp(`postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn`);
const PORT = 3000;
const bcrypt = require('bcrypt');
const saltRounds = 8;
const userTypedInPassword = 'waffles';
let storedPassword = '';


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
app.use(express.static('public'));

// Route to serve an HTML file
app.get('/connected', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        // Store the user data in the database
        users.push({
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
    });


app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });


app.post('/login', async (req, res) => {
    // Find the user by email in the database
    const user = user.find(user => user.email === req.body.email);
    if (user) {
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (error) {
            res.status(500).send('Error authenticating user');
        }
    } else {
        res.status(404).send('User not found');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`);
     });
    