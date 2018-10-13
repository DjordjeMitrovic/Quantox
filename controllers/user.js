const express = require('express');
const router = express.Router();

const path = require('path');
const appDir = path.dirname(require.main.filename);

var userModel = require(path.join(appDir, "/models/User.js"));
var user = new userModel();


router.get("/login", function (req, res) {
    res.render('pages/login/login.ejs', {
        root: appDir
    });
}); 


router.post("/login", function (req, res) {
    user.checkIfUserExists(req.body.username, req.body.password).then(function (result) {
        if (result) {
            res.render('pages/mainPage/mainPage.ejs', {
                root: appDir
            });
        } else {
            res.send("greska");
        }
    });


}); 

module.exports = router;