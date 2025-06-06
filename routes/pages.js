const express = require('express');
const request = require('request');
const axios = require('axios');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create a connection pool to the MySQL database
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Render the home page
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user, weatherMessage: null, countryData: null });
});

// Render the about page
router.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

// Render the landmarks pagen
router.get('/landmarks', async (req, res) => {
    const searchTerm = req.query.q || '';
    try {
        const [results] = await db.query('SELECT * FROM landmarks WHERE name LIKE ? OR location LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`]);
        res.render('landmarks', { user: req.session.user, searchResults: results, errorMessage: null, successMessage: null });
    } catch (error) {
        console.error(error);
        res.render('landmarks', { user: req.session.user, searchResults: [], errorMessage: 'An error occurred', successMessage: null });
    }
});

// Redirect /register to home page
router.get('/register', (req, res) => {
    res.redirect('/');
});

// Handle weather requests
router.get('/weather', (req, res, next) => {
    let apiKey = '9494a52218427a68063ad1ca6a2a5a47';
    let city = req.query.city || 'london';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                     
    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);
            if (weather && weather.main) {
                var weatherMessage = 'It is ' + weather.main.temp + 
                    ' degrees in ' + weather.name +
                    '! The humidity now is: ' + 
                    weather.main.humidity;
                res.render('index', { user: req.user, weatherMessage: weatherMessage, countryData: null });
            } else {
                res.render('index', { user: req.user, weatherMessage: 'City not found', countryData: null });
            }
        }
    });
});

// Handle country data requests
router.get('/country', async (req, res, next) => {
    const countryName = req.query.name || 'United States';
    const apiKey = '62gPXGc7u3EYTgZ0nPEM5w==5LHr1ssP1xtOmRJC';
    const apiUrl = `https://api.api-ninjas.com/v1/country?name=${countryName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (response.status === 200) {
            const countryData = response.data[0];
            res.render('index', { user: req.user, weatherMessage: null, countryData: countryData });
        } else {
            res.render('index', { user: req.user, weatherMessage: null, countryData: null });
        }
    } catch (error) {
        console.error(error);
        res.render('index', { user: req.user, weatherMessage: null, countryData: null });
    }
});

// Handle landmark upload
router.post('/landmarks', upload.single('image'), async (req, res) => {
    const { name, location } = req.body;
    const image = req.file.filename;

    try {
        await db.query('INSERT INTO landmarks (name, location, image) VALUES (?, ?, ?)', [name, location, image]);
        const [results] = await db.query('SELECT DISTINCT * FROM landmarks');
        res.render('landmarks', { user: req.user, searchResults: results, successMessage: 'Landmark added successfully!', errorMessage: null });
    } catch (error) {
        console.error(error);
        res.render('landmarks', { user: req.user, searchResults: [], errorMessage: 'An error occurred while adding the landmark.', successMessage: null });
    }
});

module.exports = router;