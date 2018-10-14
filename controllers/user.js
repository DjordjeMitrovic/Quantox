const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sha1 = require('sha1');

const path = require('path');
const appDir = path.dirname(require.main.filename);

var userModel = require(path.join(appDir, "/models/User.js"));
var user = new userModel();
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 25,
    auth: {
        user: 'plantechHF@gmail.com',
        pass: 'highfiveteam',
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true
});


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
                userdata = [];
                for (var key in userinfo) {
                    userdata.push(userinfo[key]);
                }
                user.insert(userdata).then(function (result) {
                    var mailOptions = {
                        from: 'plantechHF@gmail.com',
                        to: userinfo["email"],
                        subject: 'Authentification',
                        text: "http://" + req.get('host') + "/user/auth/" + userinfo["username"]
                    }

                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        console.log(error);


                    });
                    res.redirect("/login");
                });

            }
        });


    }




});


router.get("/auth/:username", function (req, res) {
    user.auth(req.params.username).then(function (result) {
        user.getOne(req.params.username).then(function (updatedUser) {
            req.session.user = updatedUser[0];
            res.redirect("/login");
        });

    });

});

router.get("/activate/:username", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {
        user.auth(req.params.username).then(function (result) {
            res.redirect("/user/displayAll");

        });
    }


});

router.get("/displayAll", function (req, res) {
    if (req.session.user.role != "admin") {
        res.redirect("/login");
    }

    user.getAll().then(function (results) {
        res.render("pages/displayUsers/displayUsers.ejs", {
            users: results,
            user: req.session.user

        });

    });

});

router.get("/delete/:id", function (req, res) {
    if (req.session.user.role != "admin") {
        res.redirect("/login");
    }

    user.delete(req.params.id).then(function (results) {
        res.redirect("/user/displayAll");

    });

});



module.exports = router;