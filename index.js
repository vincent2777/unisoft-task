const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fastify = require('fastify')({ logger: true });
const productRoutes = require('./routes/productRoutes');
const dbClient = require('./services/database/dbService');
const { producer } = require('./services/kafkaService');

//API SECURITY

//Register JWT authentication plugin
fastify.register(require('fastify-jwt'), {
    secret: 'supersecret', // JWT secret key
    algorithms: ['HS256'] // JWT signing algorithm
});


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers equal to the number of CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for dying workers and replace them
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    // Worker code

    // Register routes with producer and database connection
    fastify.register(productRoutes, { producer, dbClient });

    const PORT = process.env.PORT || 3000;

    const start = async () => {
        try {
            await fastify.listen(PORT);
            fastify.log.info(`Server listening on port ${PORT}`);
        } catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    };

    start();
}
