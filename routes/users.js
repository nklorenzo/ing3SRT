var express = require('express');
const db = require('../database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//router.use(express.json());
router.post('/inscription', async (req, res) => {
    const {prenom, nom, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const conn = await db.getConnection();
        const existingUser = await conn.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            conn.release();
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Insérer un nouvel utilisateur
        await conn.query('INSERT INTO users (prenom, nom, email, password) VALUES (?, ?, ?, ?)', [prenom, nom, email, password]);
        conn.release();

        res.status(201).json({ message: 'Inscription réussie !' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

//router.use(express.json()); // Middleware pour lire les données JSON

router.post('/connexion', async (req, res) => {
    const { email, password } = req.body;

    try {
        const conn = await db.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        conn.release(); // Libérer la connexion

        if (rows.length > 0) {
        //Stocker les informations de l'utilisateur dans la session
            req.session.user = {
            prenom: rows[0].prenom,
            nom: rows[0].nom,
            email: rows[0].email
            };
            res.json({ success: true, message: 'Connexion réussie' });
        } else {
           
            res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }

    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});
module.exports = router;
