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

    tickets.getAll(req.session.user.role).then(function (result) {
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

    tickets.getOne(req.params.id, req.session.user.role).then(function (ticketResult) {
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




    ];
    var ticketObject = {

        title: req.body.title,
        assignedTo: req.body.assignedTo == 'null' ? null : req.body.assignedTo,
        content: req.body.content,
        status: req.body.status == 'null' ? null : req.body.status,
        id: req.body.ticket





    }

    if (req.session.user.role == "admin") {
        ticketInfo.push(req.body.archived);
    }
    ticketInfo.push(req.body.ticket);

    tickets.update(ticketInfo, req.session.user.role, req.session.user.id, req.body.ticket, ticketObject).then(function (result) {
        res.redirect("/tickets/display");
    });

});


router.get("/delete/:id/", function (req, res) {

    if (req.session.user && req.session.user.role == "admin") {
        tickets.delete(req.params.id).then(function (ticketResult) {
            res.redirect("/tickets/display");
        });
    } else if (req.session.user) {
        tickets.getOne(req.params.id, req.session.user.role).then(function (result) {
            if (result[0].creator == req.session.user.id) {
                tickets.delete(req.params.id).then(function (ticketResult) {
                    res.redirect("/tickets/display");
                });
            } else {
                res.redirect("/tickets/display");
            }
        });


    }


});
router.get("/deleteHard/:id/", function (req, res) {

        if (req.session.user && req.session.user.role == "admin") {
            tickets.deleteHard(req.params.id).then(function (ticketResult) {
                res.redirect("/tickets/display");
            });
        } else {
            res.redirect("/tickets/display");
        }
    }






);
router.get("/displayActivity/:id", function (req, res) {
    tickets.getActivity(req.params.id).then(function (result) {
        res.render("pages/displayActivity/displayActivity.ejs", {
            user: req.session.user,
            activities: result


        });
    });

});
module.exports = router;