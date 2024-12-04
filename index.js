if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Import the modules we need
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initializePassport = require('./passport-config');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Create the express application object
const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, httpOnly: true // 86400000 1 day
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Set the directory where Express will pick up HTML files
app.set('views', path.join(__dirname, 'views'));

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
app.engine('html', ejs.renderFile);

// Define the database connection
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Make the database connection available globally
global.db = db;

db.getConnection()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log(error);
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

// Routes
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');

app.use('/auth', authRoutes);
app.use('/', pageRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.render("index", { messages: req.flash(), user: req.user });
});

app.post("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Start the web app listening
app.listen(port, () => console.log(`Server is running on port ${port}`));