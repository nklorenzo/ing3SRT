/*var express = require('express');
var router = express.Router();

// GET home page. 
router.get('/', (req, res, next) => {
    console.log('Session utilisateur :', req.session.user);
    const user = req.session.user || null;
    res.render('index', {
        user
    });
});






module.exports = router;
*/

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    // Afficher les informations de session dans la console pour débogage
    console.log('Session utilisateur :', req.session.user);

    // Récupérer l'utilisateur depuis la session ou définir comme null s'il n'est pas connecté
    user = req.session.user;

    // Rendre la vue index avec les données utilisateur
    res.render('index', {
        user
    });
});

module.exports = router;