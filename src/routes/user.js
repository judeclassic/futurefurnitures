const express = require('express');
const {Subscriptions} = require('../models/subscriptions');
const router = express.Router();

router.post("/subscribe", (req, res, next) => {
    if (req.body) {
      Subscriptions.findOne(
        {
          email: req.body.email,
        },
        function (err, result) {
          if (result) {
            res
              .status(400)
              .json("Email " + req.body.email + ' is already subscribed');
          }else{
            Subscriptions.create(req.body)
              .then(
                (user) => {
                  console.log("Email has been Added ", user);
    
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json("Subscription Successful");
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        }
      );
    } else {
      res.status(400).json({
        message: "Missing Parameter",
      });
    }
  });

  router.post("/unsubscribe", (req, res) => {
    console.log(req.body);
    Subscriptions.findOneAndRemove(
      { "email": req.body.email },
      (err, user) => {
      if (user == null) {
        res.status(400).json("Email not found");
      } else {
        res.status(200).json('Unsubscribed Successful');
      }
    });
  });


module.exports = router;