// express configuration
var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
// activate cors everywhere
var cors = require('cors');
app.use(cors());

// routing
app.get('/', function(req, res) {
    res.send('Hello World');
});

// connect to mongodb atlas
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://aliaaf:aliaaf123@cluster0.lf8tbn3.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// create user router
var userRouter = require('./user.router.js');
app.use('/users', userRouter);

