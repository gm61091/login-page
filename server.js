const express = require(`express`);
const pgp = require(`pg-promise`)();
const db = pgp(`postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn`);
const PORT = 3000;
const bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'waffles';
const path = require('path');

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
    });
});


const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/register', (req, res) => {
    res.send('Registration page');
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
    res.send('Login page');
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
    