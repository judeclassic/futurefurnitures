const express = require('express');
const emailJs = require('@emailjs/browser');
const {Subscriptions} = require('../models/subscriptions');
const router = express.Router();

emailJs.init('user_LF1IVOx1lXE5OZXFZgtxG');


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
                  const emailJson = {
                    from_name: "House Interior",
                    to_name: req.body.name,
                    message: "Welcome to future furnitures"
                  };
    
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  emailJs.sendForm('gmail', 'template_qhcze8t', req.body.email, 'service_bvckvwc', emailJson)
                  .then((result) => {
                    res.json("Subscription Successful");
                  }, (error) => {
                      console.log(error.text);
                  });
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