const fs = require('fs');

exports.addPlayerPage = (req, res) => {
        res.render('add-player.ejs', {
            title: 'Welcome to Socka | Add a new player',
            message: ''
        });
    };

    exports.addPlayer = (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.")
        }
        let message = '';
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const position = req.body.position;
        const number = req.body.number;
        const username = req.body.username;
        const uploadedFile = req.files.image;
        const fileExtension = uploadedFile.mimetype.split('/')[1];
        const image_name = username + '.' + fileExtension;
        const usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message: message,
                    title: 'Welcome to Socka | Add a new player'
                });
            } else {
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }

                        const query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "','" + position + "','" + number + "','" + image_name + "','" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                             }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid file format. Only 'gif', 'jpg' and 'png' formats are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: 'Welcome to Socka | Add a new player'
                    });
                }
            }
        });
    }

    exports.editPlayerPage = (req, res) => {
        const playerId = req.params.id;
        const query = "SELECT * FROM `players` WHERE id='" + playerId + "';";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: 'Edit player',
                player: result[0],
                message: ''
            });
        });
    }

    exports.editPlayer = (req, res) => {
        const playerId = req.params.id;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const position = req.body.position;
        const number = req.body.number;
        const query = "UPDATE `players` SET `first_name` = '" + first_name + "',`last_name` = '" + last_name + "',`position` = '" + position + "',`number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "';";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }

    exports.deletePlayer = (req, res) => {
        const playerId = req.params.id;
        const getImageQuery = "SELECT image from `players` WHERE id = '" + playerId + "';";
        const deleteUserQuery = "DELETE from `players` WHERE id = '" + playerId + "';";
        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            const image = result[0].image;
            fs.unlink(`public/assets/img/${image}`,(err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                res.redirect('/');
                });
            });
        });
    }