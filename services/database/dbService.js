const { Client } = require('scylla-driver');

// Create a client for ScyllaDB
const client = new Client({
  contactPoints: ['127.0.0.1'], // ScyllaDB contact points
  localDataCenter: 'datacenter1',
  keyspace: 'unisoft_ecommerce'
});

// Define the keyspace and table if they don't exist
async function createKeyspaceAndTable() {
  try {
    await client.connect();
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS unisoft_ecommerce 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3}`
    );
    await client.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price DECIMAL,
        quantity INT
      )`
    );
  } catch (err) {
    console.error(err);
  }
}

createKeyspaceAndTable();

module.exports = client;
