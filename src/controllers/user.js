var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var authenticate = require('../lib/authenticate.js');
var User = require('../models/user.js');


exports.uploadProfilePic = (req, res) => {
    console.log(req.file);
    console.log("path name");
    console.log(req.file.filename);
    User.findOneAndUpdate(
      { _id: req.params.userid },
      { $set: { profile_image_url: req.file.filename } },
      { new: true },
      (err, user, doc) => {
        if (!err) {
          console.log(user.profile_image_url);
          res.status(200).json({
            code: 200,
            message: "Profile image uploaded",
            updateUser: user,
          });
        } else {
          console.log(err);
        }
      }
    );
  }

exports.login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user == null) {
        res.json({
          code: 400,
          message: "Invalid email"
        });
      } else {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          const accessToken = jwt.sign(
            {
              id: user._id,
              email: user.email,
              password: user.password
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );
          
          let response = {};

          user.password = undefined;
          user.confirmpassword = undefined;

          response.code = 200;
          response.message = 'Sign in Successfull';
          response.accesstoken = accessToken;
          response.user = user;

          console.log(response);
          res.json(response);
        } else {
          res.json({
            code: 400,
            message: "Invalid password"
          });
        }
      }
    });
  }

exports.logOut =  (req, res) => {
    res.json('logged out');
  }

exports.sendMailOTP = (req, res) => {
  console.log(val);
  transporter.sendMail(
    {
      from: '"PoolYourCar 👻" <poolyourc@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Email Verification ✔", // Subject line
      text: "Email Verification code", // plain text body
      html: "<b>Your verification code is " + val + "</b>", // html body
    },
    function (error, info) {
      if (error) {
        res.send(error);
      } else {
        res.send("Email sent: " + info.response);
      }
    }
  );
}

exports.verifyEmail = (req, res) => {
  console.log(req.params.id);
  if (req.body.code == val) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { emailverified: true } },
      { new: true },
      (err, user, doc) => {
        if (!err) {
          console.log(user.emailverified);
          res.status(200).json({
            code: 200,
            message: "Email Verified",
            updateUser: doc,
          });
        } else {
          console.log(err);
        }
      }
    );
  } else {
    console.log("bbhr");
    res.json("Invalid code");
  }
}

exports.getAllUsers = (req, res) => {
  User.find({}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
}

exports.addUser = (req, res, next) => {
  var datetime = new Date();
  date = datetime.toJSON();
  console.log(req.body);
  let hash = bcrypt.hashSync(req.body.password, 10);
  if (req.body) {
    User.findOne(
      {
        email: req.body.email,
      },
      function (err, result) {
        if (result) {
          res
            .json({
              code: 400,
              message: "Email " + req.body.email + '" is already taken'
            });
        }else{
          
          User.findOne(
            {
              phonenumber: req.body.phonenumber,
            },
      
            function (err, result) {
              if (err) console.err(err);
              if (result) {
                res
                  .json({
                    code: 400,
                    message: "Phone number " + req.body.phonenumber + '" is already taken'
                  });
              }

              var newuser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                password: hash,
                confirmpassword: hash,
                createdat: date,
              };
              User.create(newuser)
                .then(
                  (user) => {
                    console.log("User has been Added ", user);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user);
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
    res.status(400).json({
      code: 400,
      message: "Missing Parameters",
    });
  }
}

exports.getUser = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      res.json({
        code: 404,
        message: "unable to retrieve data"
      });
    } else {
      const accessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          password: user.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      
      let response = {};

      user.password = undefined;
      user.confirmpassword = undefined;

      response.code = 200;
      response.message = 'Refreshed';
      response.accesstoken = accessToken;
      response.user = user;
      res.json(response);
    }
  });
}

exports.getSingleUser = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
}

exports.editUser = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, data) => {
      if (!err) {
        res.status(200).json({
          code: 200,
          message: "User updated successfully",
          updateUser: data,
        });
      } else {
        console.log(err);
      }
    }
  );
}


exports.updatePassword = (req, res) => {
  let hashpassword = bcrypt.hashSync(req.body.password, 10);

  User.findById(req.params.id, (err, user, data) => {
    console.log("this is the user", user);
    if (bcrypt.compareSync(req.body.currentpassword, user.password)) {
      console.log(user.password);

      User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { password: hashpassword, confirmpassword: hashpassword } },
        { new: true },
        (err, doc) => {
          if (!err) {
            console.log(doc);
            res.status(200).json({
              code: 200,
              message: "Password Updated",
              updateUser: doc,
            });
            //console.log("Password Updated");
          } else {
            console.log(err);
          }
        }
      );
    } else {
      console.log(err);
    }
  });
}


exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (!err) {
      res.status(200).json({
        code: 200,
        message: "User deleted successfully",
        deleteUser: data,
      });
    } else {
      console.log(err);
    }
  });
}
