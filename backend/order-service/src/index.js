require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
// const cors = require('cors');
const app = express();
app.use(express.json());


// enable cors
// app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Default route html text
app.get('/', (req, res) => {
    res.send('Order service');
});

// Endpoint to place an order
app.post('/place-order', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Check if the orders table exists, create if not
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL
            );
        `);

        const result = await pool.query(
            'INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, productId, quantity]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error placing order');
    }
});


// Endpoint to fetch all orders
app.get('/all-orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching orders');
    }
});

const PORT = process.env.ORDER_PORT || 3002;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));

