var express = require('express');
var router = express.Router();

app.get("/", function (req, res, next) {
    res.end("<hl> Bienvenue dans la partie administration du site </h1>");
});

module.exports = router;