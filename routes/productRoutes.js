const productController = require('../controllers/productController');


async function productRoutes(fastify, options) {
    fastify.post('/products/add', { auth: 'jwt' }, productController.createProduct);
    fastify.get('/products/fetch-all', { auth: 'jwt' }, productController.getAllProducts);
    fastify.get('/products/:id', { auth: 'jwt' }, productController.getProductById);
    fastify.put('/products/:id', { auth: 'jwt' }, productController.updateProduct);
    fastify.delete('/products/:id', { auth: 'jwt' }, productController.deleteProduct);
}


module.exports = productRoutes;
