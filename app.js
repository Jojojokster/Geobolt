if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Import express and ejs
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Updated to use mysql2/promise
const dotenv = require('dotenv');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config({ path: './.env' });

// Create the express application object
const app = express();

app.use(cookieParser());

// Set Connection to sql
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Initialize Passport
initializePassport(
    passport, 
    async email => {
        const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return results.length > 0 ? results[0] : null;
    },
    async id => {
        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    }
);

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');

db.getConnection()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log(error);
    });

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(flash());
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false, // Don't save back to the session store if there have been no changes
        saveUninitialized: false, // Don't save if there was no data
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, httpOnly: true // 86400000 1 day
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth.js'));

app.get('/', (req, res) => {
    res.render("index", { messages: req.flash(), user: req.user });
});

app.post("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/");
    });
});

app.listen(8000, () => {
    console.log(`Server is running`);
});
