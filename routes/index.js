var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const user= req.session.user || null;//recupère l'utilisateur de la session
    res.render('index',{user} );//passez l'utlisateur à EJS
});






module.exports = router;