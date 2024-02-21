
const { producer } = require('../services/kafkaService');
const client = require('../services/database/dbService');
const ProductService = require('../services/productService');
const productService = new ProductService(producer,client);

// Controller methods
async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        const product = await productService.updateProduct(id, { name, price, quantity });

        if (product === null) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.send(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal server error');
    }
};

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await productService.deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.send(deletedProduct);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
