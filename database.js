// database.js
require('dotenv').config(); // Charge les variables d'environnement
const mariadb = require('mariadb');

// Configuration de la pool de connexion
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 5
});

// Fonction pour obtenir une connexion à partir de la pool
async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw error;
    }
}

// Export de la fonction de connexion
module.exports = {
    getConnection
};
