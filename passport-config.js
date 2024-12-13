const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Create a connection pool to the MySQL database
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

function initialize(passport, getUserByEmail, getUserById) {
    // Define the authenticateUser function
    const authenticateUser = async (email, password, done) => {
        try {
            // Query the database for the user by email
            const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = results[0];
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            console.log(e);
            return done(e);
        }
    };

    // Configure the local strategy for Passport
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            // Query the database for the user by ID
            const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            const user = results[0];
            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'));
            }
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initialize;