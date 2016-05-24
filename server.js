var http = require('http');
var express = require("express");
var app = express();
app.set('view engine', 'ejs');
var routes = require('./routes');
var path = require('path');
var router = express.Router();
var ismaRoute = require('./routes/isma');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", routes.home);

app.get("/ismaView", routes.isma);

app.use('/ismaView/control', ismaRoute);



app.listen(3000, function() {
    console.log("Live at port 3000");
});

