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

// Load environment variables from .env file
dotenv.config();

// Create the express application object
const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
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

// Passport configuration
require('./passport-config')(passport);

// Routes
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');

app.use('/auth', authRoutes);
app.use('/', pageRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Geobolt app listening on port ${port}!`));