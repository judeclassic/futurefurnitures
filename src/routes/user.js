const express = require('express');
const {Subscriptions} = require('../models/subscriptions');
const router = express.Router();
const emailHandler = require('../lib/emailHandler');

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
              emailHandler.send({
                    "Messages":[
                        {
                            "From": {
                                "Email": "justclassic24@gmail.com",
                                "Name": "Future Furnitures"
                            },
                            "To": [
                                {
                                    "Email": req.body.email,
                                    "Name": req.body.name
                                }
                            ],
                            "TemplateID": 3515504,
                            "TemplateLanguage": true,
                            "Subject": "Welcome to Future Furniture, Get to build your furniture",
                            "Variables": {
                                "name": req.body.name
                            }
                        }
                    ]
                },
                (err, result) => {
                  if (err) {
                    return res.status(401).json(err);
                  }
                  Subscriptions.create({
                    email: req.body.email,
                    name: req.body.name
                  })
                    .then(
                      (user) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.status(200).json("Subscription Successful");
                      },
                      (err) => next(err)
                    )
                    .catch((err) => next(err));
                }
              );
          }
        }
      );
    } else {
      res.status(400).json("Missing Parameter");
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