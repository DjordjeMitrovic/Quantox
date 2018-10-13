const express = require('express');
const router = express.Router();

const sha1 = require('sha1');

const path = require('path');
const appDir = path.dirname(require.main.filename);

var userModel = require(path.join(appDir, "/models/User.js"));
var user = new userModel();



router.get("/logout", function (req, res) {

    req.session = null;
    res.redirect("/login");
});

router.post("/login", function (req, res) {
    user.checkIfUserExists(req.body.username, req.body.password).then(function (result) {
        if (result.length > 0) {
            req.session.user = result[0];
            res.redirect('/');
        } else {
            res.send("greska");
        }
    });


});


router.post("/register", function (req, res) {

    var userinfo = [];

    userinfo["firstName"] = req.body.firstName;
    userinfo["lastName"] = req.body.lastName;
    userinfo["username"] = req.body.username;
    userinfo["password"] = sha1(req.body.pass1);
    userinfo["email"] = req.body.email;
    
    if (req.body.pass1 != req.body.pass2) {
        res.render("pages/register/register.ejs", {
            code: 400,
            success: false,
            message: "Passwords do not match.",
            user: user
        });
    } else {
        user.checkIfUnique(req.body.username, req.body.email).then(function (result) {
            if (result.length > 0) {
                res.render("pages/register/register.ejs", {
                    code: 400,
                    success: false,
                    message: "Username or email already taken",
                    user: userinfo
                });
            } else {
                    user.insert(userinfo).then(function(result){
                        console.log(result);
                        res.redirect("/login");
                    });

            }
        });


    }




});



module.exports = router;