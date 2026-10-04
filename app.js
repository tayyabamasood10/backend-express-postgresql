
import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());

// HOME PAGE API
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to my API"
    });
});

// ==================== PRODUCTS ====================

// GET PRODUCTS API
app.get("/products", (req, res) => {

    pool.query(
        "SELECT * FROM products ORDER BY id",
        (error, result) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Failed to get products"
                });
            }

            res.json(result.rows);
        }
    );

});


// CREATE PRODUCT API
app.post("/products", (req, res) => {

    const { name, price } = req.body;

    pool.query(
        "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
        [name, price],
        (error, result) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Failed to insert product"
                });
            }

            res.json(result.rows[0]);
        }
    );

});


// ==================== USERS ====================

// CREATE USER API

app.post("/users", (req, res) => {
    const { name, email } = req.body;

    // Check if user already exists
    pool.query(
        "SELECT * FROM users WHERE name = $1 AND email = $2",
        [name, email],
        (error, result) => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Failed to check user"
                });
            }

            // User already exists
            if (result.rows.length > 0) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            // Add new user
            pool.query(
                "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
                [name, email],
                (error, result) => {
                    if (error) {
                        console.error(error);

                        return res.status(500).json({
                            error: "Failed to insert user"
                        });
                    }

                    res.json(result.rows[0]);
                }
            );
        }
    );
});


// GET USERS API
app.get("/users", (req, res) => {

    pool.query(
        "SELECT * FROM users ORDER BY id",
        (error, result) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Failed to get users"
                });
            }

            res.json(result.rows);
        }
    );

});

// DELETE USER API
app.delete("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id],
        (error, result) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Failed to delete user"
                });
            }

            res.json({
                message: "User deleted successfully",
                user: result.rows[0]
            });
        }
    );

});

// ==================== DATABASE ====================

// Database connection
pool.query("SELECT NOW()", (error, result) => {

    if (error) {
        console.log("Database connection failed");
        console.error(error);
    } else {
        console.log("Database connected successfully");
    }

});


// Create products table
pool.query(`
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price INTEGER
    )
`, (error) => {

    if (error) {
        console.log("Products table creation failed");
        console.error(error);
    } else {
        console.log("Products table created successfully");
    }

});


// Create users table
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
    )
`, (error) => {

    if (error) {
        console.log("Users table creation failed");
        console.error(error);
    } else {
        console.log("Users table created successfully");
    }

});


// ==================== SERVER ====================

app.listen(5000, () => {
    console.log("Server running on port 5000");
});