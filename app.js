
import express from "express";
import pool from "./db.js";

const app = express();

const products = [];

app.use(express.json());

// GET API

app.get("/products", (req, res) => {
    res.json(products);
});

// CREATE API

app.post("/products", (req, res) => {

    const product = {
        id: products.length + 1,
        name: "Laptop",
        price: 50000
    };

    products.push(product);

    res.json(product);

});

// UPDATE API

app.put("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find((product) => product.id === id);

    product.name = req.body.name;
    product.price = req.body.price;

    res.json(product);

});
// DELETE API

app.delete("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const productIndex = products.findIndex((product) => product.id === id);

    products.splice(productIndex, 1);

    res.json("Product deleted successfully");

});




pool.query("SELECT NOW()", (error, result) => {
    if(error){
        console.log("Database connection failed");
        console.error(error);
    }
    else{
        console.log("Database connected successfully");
        console.log(result.rows);
    }

})







// app.get("/", (req, res) => {
//     res.json("hello server is runing on port 5000");
// });



app.listen(5000, () => {
    console.log("server running on port 5000");
});