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
    res.send('Product service');
});

// Endpoint to add a product
app.post('/add-product', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        // Check if the 'products' table exists, and create it if it doesn't
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL
            );
        `);

        // Now insert the product into the table
        const result = await pool.query(
            'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
        );

        // Respond with the inserted product
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding product');
    }
});


// Endpoint to fetch all products
app.get('/get-products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

// Endpoint to update a product
app.put('/update-product/:productId', async (req, res) => {
    const { productId } = req.params;
    const { name, description, price } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
            [name, description, price, productId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product');
    }
});

const PORT = process.env.PRODUCT_PORT || 3003;
app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
