const { Router } = require("express");
const { getAllProducts, } = require("../model/products.model");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener los productos" });
    }
});

module.exports = router;