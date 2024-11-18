var express = require('express');
const db = require('../database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'ecommerce',
    expiration: 10000000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

var router = express.Router();



router.use(session({
    secret: '1234',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }

}));
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// Inscription d'un nouvel utilisateur
router.post('/inscription', async (req, res) => {
    const {
        prenom,
        nom,
        email,
        password
    } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé.'
            });
        }

        // Insérer un nouvel utilisateur
        await db.query('INSERT INTO users (prenom, nom, email, password) VALUES (?, ?, ?, ?)', [
            prenom,
            nom,
            email,
            password
        ]);

        res.status(201).json({
            message: 'Inscription réussie !'
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({
            message: 'Erreur serveur.'
        });
    }
});



// Connexion d'un utilisateur
router.post('/connexion', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        // Vérifier les identifiants
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        const user = rows[0];
        if (rows.length > 0) {
            // Stocker les informations de l'utilisateur dans la session
            req.session.user = {
                id: user.id,
                nom: user.nom
            };
            req.session.save((err) => {
                if (err) {
                    console.error('Erreur de sauvegarde de session :', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur serveur'
                    });
                }
                res.json({
                    success: true,
                    message: 'Connexion réussie'
                });
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
});


module.exports = router;