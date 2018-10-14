const express = require('express');
const app = express();
const session = require('cookie-session')

const path = require('path');
const bodyParser = require("body-parser");

const port = 3000;
const appDir = path.dirname(require.main.filename);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('trust proxy', 1);

app.use(session({
    name: 'session',
    keys: ["key"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(function (req, res, next) {
    

    if (!req.session || !req.session.user) {
        if (req.originalUrl != "/register" && req.originalUrl != "/login" && req.originalUrl != "/user/login" && req.originalUrl != "/user/register") res.redirect("/login");

    }
    next();
});

app.set('view engine', 'ejs');

app.listen(process.env.PORT | port, function () {
    console.log("Server is running on port " + port);
});

const user = require('./controllers/user');
const tickets = require('./controllers/tickets');

const pages = require('./controllers/pages');

app.use('/', pages);
app.use("/user", user);
app.use("/tickets", tickets);