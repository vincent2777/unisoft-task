const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function connectKafka() {
  await producer.connect();
}

module.exports = {
  producer,
  connectKafka
};
