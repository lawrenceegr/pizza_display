require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
// const cors = require('cors');

const app = express();
app.use(express.json());

// enable cors
// app.use(cors(
//     {
//         origin: "*",
//         credentials: true,
//     }
//     ));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Default route html text
app.get('/', (req, res) => {
    res.send('Authentication service');
});

// Endpoint to register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the users table exists, create if not
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );

        res.json({ userId: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});



// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        // If user does not exist
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        // Compare hashed passwords
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect password');
        }

        // Return a success response with user ID (or a token if you're using JWT)
        res.json({ userId: user.id, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

// Update user endpoint
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        let query = 'UPDATE users SET username = $1';
        let values = [username];

        // If a password is provided, hash it and update the password as well
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = $2';
            values.push(hashedPassword);
        }

        query += ' WHERE id = $3 RETURNING *';
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});

// Delete user endpoint
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
});

// List all users endpoint
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username FROM users');

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
    }
});


const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
