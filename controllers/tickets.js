const express = require('express');
const router = express.Router();
const path = require('path');
const appDir = path.dirname(require.main.filename);
var ticketModel = require(path.join(appDir, "/models/Tickets.js"));
var statusModel = require(path.join(appDir, "/models/Statuses.js"));
var usersModel = require(path.join(appDir, "/models/User.js"));
var tickets = new ticketModel();
var status = new statusModel();
var users = new usersModel();


router.get("/display", function (req, res) {

    tickets.getAll().then(function (result) {
        res.render("pages/displayTickets/displayTickets.ejs", {
            user: req.session.user,
            tickets: result
        });
    });

});

router.get("/add", function (req, res) {
    users.getAll().then(function (userResults) {

        status.getAll().then(function (statusesResult) {
            res.render("pages/addTickets/addTickets.ejs", {
                user: req.session.user,
                statuses: statusesResult,
                allUsers: userResults,
                ticket: null


            });


        });
    });


});

router.post("/add", function (req, res) {

    var ticketInfo = [
        req.body.title,
        req.body.assignedTo == 'null' ? null : req.body.assignedTo,
        req.body.content,

        req.session.user.id,
        req.body.status == 'null' ? null : req.body.status

    ];

    tickets.insert(ticketInfo).then(function (result) {
        res.redirect("/tickets/display");
    });

});


router.get("/edit/:id", function (req, res) {

    tickets.getOne(req.params.id).then(function (ticketResult) {
        users.getAll().then(function (userResults) {

            status.getAll().then(function (statusesResult) {
                console.log(ticketResult);
                res.render("pages/addTickets/addTickets.ejs", {
                    user: req.session.user,
                    statuses: statusesResult,
                    allUsers: userResults,
                    ticket: ticketResult[0]


                });
            });


        });
    });

});

router.post("/edit", function (req, res) {

    var ticketInfo = [
        req.body.title,
        req.body.assignedTo == 'null' ? null : req.body.assignedTo,
        req.body.content,
        req.body.status == 'null' ? null : req.body.status,


        req.body.ticket

    ];

    tickets.update(ticketInfo).then(function (result) {
        res.redirect("/tickets/display");
    });

});


router.get("/delete/:id", function (req, res) {

    tickets.delete(req.params.id).then(function (ticketResult) {
        res.redirect("/tickets/display");
    });

});


module.exports = router;