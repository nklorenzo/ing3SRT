/* var express = require('express');
const db = require('../database');
var router = express.Router();




// GET users listing. 
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
                prenom: user.prenom,
                nom: user.nom,
                email: user.email

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


// Route de déconnexion
router.post('/deconnexion', (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la déconnexion'
            });
        }

        // Effacer le cookie de session
        res.clearCookie('connect.sid'); // Le nom de votre cookie de session par défaut est "connect.sid"

        return res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    });
});

module.exports = router;
*/



const express = require('express');
const db = require('../database'); // Connexion à la base de données
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

/** 
 * Inscription d'un nouvel utilisateur
 */
router.post('/inscription', async (req, res) => {
    const { prenom, nom, email, password } = req.body;

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
            prenom, nom, email, password
        ]);

        res.status(201).json({ message: 'Inscription réussie !' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/** 
 * Connexion d'un utilisateur
 */
router.post('/connexion', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier les identifiants
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];

            // Stocker les informations utilisateur dans la session
            req.session.user = {
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email
            };

            req.session.save((err) => {
                if (err) {
                    console.error('Erreur de sauvegarde de session :', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur serveur'
                    });
                }
                res.json({ success: true, message: 'Connexion réussie' });
            });
        } else {
            res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

/** 
 * Déconnexion d'un utilisateur
 */
router.post('/deconnexion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
        }

        // Effacer le cookie de session
        res.clearCookie('connect.sid'); // Nom du cookie de session par défaut

        res.json({ success: true, message: 'Déconnexion réussie' });
    });
});


// Routes du panier
// Ajouter un article au panier
router.post('/cart/add', (req, res) => {
    const { userId, productId, quantity } = req.body;
    const sql = `INSERT INTO Cart (userId, productId, quantity) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

    db.query(sql, [userId, productId, quantity, quantity], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        res.send({ message: 'Article ajouté au panier', result });
    });
});

// Récupérer les articles du panier d'un utilisateur
router.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT Cart.id, Cart.productId, Cart.quantity, Products.name, Products.price 
        FROM Cart 
        JOIN Products ON Cart.productId = Products.id 
        WHERE Cart.userId = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        res.send(results);
    });
});

// Mettre à jour la quantité d'un article dans le panier
router.put('/cart/update', (req, res) => {
    const { userId, productId, quantity } = req.body;
    const sql = `UPDATE Cart SET quantity = ? WHERE userId = ? AND productId = ?`;

    db.query(sql, [quantity, userId, productId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        res.send({ message: 'Quantité mise à jour', result });
    });
});

// Supprimer un article du panier
router.delete('/cart/delete', (req, res) => {
    const { userId, productId } = req.body;
    const sql = `DELETE FROM Cart WHERE userId = ? AND productId = ?`;

    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        res.send({ message: 'Article supprimé', result });
    });
});


module.exports = router;
