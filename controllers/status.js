const express = require('express');
const router = express.Router();
const path = require('path');
const appDir = path.dirname(require.main.filename);
var statusesModel = require(path.join(appDir, "/models/Statuses.js"));
var statuses = new statusesModel();




router.get("/add", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {
        res.render("pages/addStatus/addStatus.ejs");
    }

});
router.get("/edit/:id", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {
        statuses.getOne(req.params.id).then(function (results) {
            res.render("pages/addStatus/addStatus.ejs", {
                update: true,
                statusInfo: results[0]

            });

        });
    }

});

router.post("/add", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {
        statuses.add(req.body.name, req.session.user.id).then(function (results) {
            res.redirect("/status/displayStatuses");
        });
    }

});

router.get("/displayStatuses", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {

        statuses.getAll().then(function (results) {
            res.render("pages/displayStatuses/displayStatuses.ejs", {
                statuses: results,
                user: req.session.user
            });
        });
    }
});

router.get("/delete/:id", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {

        statuses.delete(req.params.id).then(function (results) {
            res.redirect("/status/displayStatuses");
        });
    }
});
router.post("/edit", function (req, res) {
    if (!req.session.user || req.session.user.role != "admin") {
        res.redirect("/login");
    } else {
        statuses.update(req.body.id, req.session.user.id, req.body.name).then(function (results) {
            res.redirect("/status/displayStatuses"); // IZMENI
        });
    }

});





module.exports = router;