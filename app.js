var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'ecommerce',
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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
require('dotenv').config();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuration des middlewares (ordre important)
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


// Body parser pour les formulaires POST
app.use(bodyParser.urlencoded({
    extended: true
}));

// Configuration de express-session
app.use(session({
    secret: '1234',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false // Passer à true en production si HTTPS est activé
    }
}));

app.use((req, res, next) => {
    req.session.user = req.session.user
    next()
});

// Définition des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Gestion des erreurs 404
app.use(function(req, res, next) {
    next(createError(404));
});

// Gestionnaire des erreurs
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;