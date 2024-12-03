const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        if (!name || !email || !password || !confirm_password) {
            return res.json({
                status: 'error',
                message: 'Please fill in all fields'
            });
        }

        if (password !== confirm_password) {
            return res.json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        const [results] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

        if (results.length > 0) {
            return res.json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await db.query('INSERT INTO users SET ?', {
            name: name,
            email: email,
            password: hashedPassword
        });

        return res.json({
            status: 'success',
            message: 'Registration successful!'
        });

    } catch (error) {
        console.log(error);
        return res.json({
            status: 'error',
            message: 'An error occurred'
        });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.json({
                status: 'error',
                message: 'An error occurred'
            });
        }
        if (!user) {
            return res.json({
                status: 'error',
                message: info.message
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.json({
                    status: 'error',
                    message: 'An error occurred'
                });
            }
            return res.json({
                status: 'success',
                message: 'Login successful!'
            });
        });
    })(req, res, next);
};