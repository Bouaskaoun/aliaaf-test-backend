// create user controller

const User = require('./user.model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.user_create = function(req, res) {
    console.log(req);
    let user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, saltRounds)
    });
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        res.send('User Created successfully');
    });
};

exports.user_details = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return next(err);
        res.send(user);
    });
};

exports.user_update = function(req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, user) {
        if (err) return next(err);
        res.send('User udpated.');
    });
};

exports.user_delete = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    });
};

exports.user_login = function(req, res) {
    User.findOne({username : req.body.username}, function(err, user) {
        if (err) return next(err);
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send('Login successful');
        } else {
            res.send('Login failed');
        }
    });
};

// get all users
exports.user_list = function(req, res) {
    User.find({}, function(err, users) {
        if (err) return next(err);
        res.send(users);
    });
}

