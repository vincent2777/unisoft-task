const { connectKafka } = require('./kafkaService');
const { v4: uuidv4 } = require('uuid');

class ProductService {
    constructor(producer, client) {
        this.producer = producer;
        this.client = client;
        connectKafka().catch(console.error);
    }

    async createProduct({ name, price, quantity }) {
        try {
            const id = uuidv4();
            const product = { id, name, price, quantity };
            await this.client.execute('INSERT INTO products (id, name, price, quantity) VALUES (?, ?, ?, ?)', [id, name, price, quantity]);
            await this.producer.send({ topic: 'new-products', messages: [{ value: JSON.stringify(product) }] });
            return { success: true, message: 'Product added', data: product };

        } catch (error) {
            console.error('Error creating product:', error);
            return { success: false, message: 'Product could not be created ' + error };
        }
    }

    async getAllProducts() {
        try {
            const result = await this.client.execute('SELECT * FROM products');
            await this.producer.send({ topic: 'products-fetched', messages: [{ value: JSON.stringify(result.rows) }] });
            return { success: true, message: 'Products fetched', data: result.rows };
        } catch (error) {
            console.error('Error fetching all products:', error);
            return { success: false, message: 'Products could not be retrieved ' + error };
        }
    }

    async getProductById(id) {
        try {
            const result = await this.client.execute('SELECT * FROM products WHERE id = ?', [id]);
            await this.producer.send({ topic: 'product-fetched', messages: [{ value: JSON.stringify(result.rows[0]) }] });
            return { success: true, message: 'Product fetched', data: result.rows[0] };
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return { success: false, message: 'Product could not be retrieved ' + error };
        }
    }

    async updateProduct(id, { name, price, quantity }) {
        try {
            await this.client.execute('UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]);
            const product = { id, name, price, quantity };
            await this.producer.send({ topic: 'product-updated', messages: [{ value: JSON.stringify(product) }] });

            return { success: true, message: 'Product updated', data: product };

        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, message: 'Product could not be updated ' + error };
        }
    }

    async deleteProduct(id) {
        try {
            const result = await this.client.execute('DELETE FROM products WHERE id = ?', [id]);
            if (!result.rows.length) return null;
            await this.producer.send({ topic: 'product-deleted', messages: [{ value: JSON.stringify(result.rows[0]) }] });

            return { success: true, message: 'Product deleted', data: result.rows[0] };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, message: 'Product could not be deleted ' + error };
        }
    }
}

module.exports = ProductService;
