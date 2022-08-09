const fs = require('fs');

exports.getHomePage = (req,res) => {
    const query = 'SELECT * FROM `players` ORDER BY id ASC';
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        res.render('index.ejs', {
            title: 'Welcome to Socka | View Players',
            players: result
        });
    });
};