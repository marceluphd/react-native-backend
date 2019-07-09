const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');

const {User} = require("../models/user");
const {authenticate} = require("../middlewares/authenticate");

const s3 = new AWS.S3({
  accessKeyId: "AKIAUBWMSO5MLMFK6NNP",
  secretAccessKey: "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",
  signatureVersion: 'v4',
  region: "ap-south-1"
});

router.post("/create", (req, res) => {
    const userData = req.body;
    console.log(userData);
    const user = new User(userData);
    user.save().then((user) => {
          if(user) {
              return user.generateAuthToken();
          } else {
              res.sendStatus(400);
          }
    }).then((token) => {
        res.header({"x-auth": token}).send(user);
    }).catch((error) => {
          res.status(400).send(error);
    })
});

router.post("/login", (req, res) => {
    User.findUserByCredentails(req.body.email, req.body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header({"x-auth": token}).send(user);
        });
    }).catch((e) => {
		    res.status(400).send("wrong credentials");
	  });
});

router.delete("/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
      res.status(200).send("user logged out");
  }).catch(() => {
      res.status(401).send();
  });
});

router.get("/user", authenticate, (req, res) => {
    res.send(req.user);
});

router.get('/upload', authenticate, (req, res) => {
    const key = `${req.user._id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'game-app',
        ContentType: 'image/jpeg',
        Key: key
      },
      (err, url) => res.send({ key, url })
    );
});

router.put("/update", authenticate, (req, res) => {
    User.updateUserInfo(req.user._id, req.body).then((user) => {
        res.status(200).send(user);
    }).catch((error) => {
        res.status(401).send(error);
    });
});

module.exports = router;
