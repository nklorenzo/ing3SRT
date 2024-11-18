// database.js
require('dotenv').config(); // Charge les variables d'environnement
const mariadb = require('mysql2');

// Configuration de la pool de connexion
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 5
});

const promisePool = pool.promise();


// Export de la fonction de connexion
module.exports = promisePool;