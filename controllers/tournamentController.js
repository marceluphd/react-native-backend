const express = require('express');
const router = express.Router();

const {Tournament} = require("../models/tournament");
const {authenticate} = require("../middlewares/authenticate");

router.post("/create", authenticate, (req, res) => {
    if(req.user.roles === "admin") {
        const tournamentData = req.body;
        const tournament = new Tournament(tournamentData);

        tournament.save().then((tournament) => {
              if(tournament) {
                  res.send(tournament);
              } else {
                  res.sendStatus(400);
              }
        }).catch((error) => {
              res.status(400).send(error);
        });
    } else {
        console.log(req.user);
        res.status(400).send();
    }
});

router.get("/getTournements", authenticate, (req, res) => {
    Tournament.find({}).then((list) => {
        if(list) {
          res.send(list);
        } else {
          throw new Error("No Tournaments");
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
});

module.exports = router;
