const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const apiRouter = require('./routes/api.js')

const app = express()
const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("eftheque", "root", "",
    {
        dialect: "mysql",
        host: "localhost"
    });
try {
    sequelize.authenticate();
    console.log("Connecté à la base de donnée MySql avec Sequelize");
} catch (error) {
    console.error('Problème de connexion, l\'erreur est la suivante:',
        error);
}


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret: 'grehjznejzkhgjrez', saveUninitialized: false, resave: false }))
app.use(express.static(path.join(__dirname, '../client')))

app.use('/api/', apiRouter)

module.exports = app
