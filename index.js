const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require("body-parser");

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');

app.listen(process.env.PORT | port, function () {
    console.log("Server is running on port " + port);
});

const user = require('./controllers/user');
const pages = require('./controllers/pages');

app.use('/', pages);
app.use("/user", user); 
