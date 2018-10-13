const express = require('express');
const router = express.Router();

const path = require('path');
const appDir = path.dirname(require.main.filename);

router.get('/', function (req, res, next) {

    res.render('pages/mainPage/mainPage.ejs', {
        root: appDir,
        user: req.session.user
    });

});
router.get("/login", function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('pages/login/login.ejs', {
            root: appDir
        });
    }
});
router.get("/register", function (req, res) {
    var userinfo = [];
    userinfo["firstName"] = "";
    userinfo["lastName"] = "";
    userinfo["username"] = "";
    userinfo["password"] = "";
    userinfo["email"] = "";
    res.render('pages/register/register.ejs', {   
        user: userinfo,    
        root: appDir
    });
});

module.exports = router;