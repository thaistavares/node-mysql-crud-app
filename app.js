'use strict';

const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const homeRoutes = require('./routes/index.routes');
const playerRoutes = require('./routes/player.routes');

const port = 3000;
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err)=>{
    if(err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

app.set('port',port);
app.set('views', __dirname.concat('/views'));
app.set('view engine','ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(fileUpload());

app.use('/',homeRoutes);
app.use('/player',playerRoutes);
app.get('*', (req,res,next) => {
    res.status(404);
    res.render('404.ejs', {
        title: 'Page Not Found'
    });
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});