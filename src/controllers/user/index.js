var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var authenticate = require('../../lib/authenticate.js');
var {User} = require('../../models/user.js');

exports.uploadProfilePic = (req, res) => {
  console.log(req.file);
  console.log("path name");
  console.log(req.file.filename);
  User.findOneAndUpdate(
    { _id: req.params.userId },
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
          message: "Invalid email",
          isSuccess: false,
          data: {}
        });
      } else {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          const accessToken = jwt.sign(
            {
              id: user._id,
              email: user.email,
              password: user.password
            },
            process.env.ACCESS_TOKEN_SECRET || '123456789',
            {
              expiresIn: "1d",
            }
          );
          
          let response = {};

          user.password = undefined;
          user.confirmPassword = undefined;

          response.code = 200;
          response.isSuccess = true;
          response.message = 'Sign in Successful';
          response.accessToken = accessToken;
          response.data = user;

          console.log(response);
          res.json(response);
        } else {
          res.json({
            isSuccess: false,
            data: {},
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



exports.verifyEmail = (req, res) => {
  console.log(req.params.id);
  if (req.body.code == val) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { emailVerified: true } },
      { new: true },
      (err, user, doc) => {
        if (!err) {
          console.log(user.emailVerified);
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
    console.log("working");
    res.json("Invalid code");
  }
}


//GET ALL USER DATA
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
  var dateTime = new Date();
  date = dateTime.toJSON();
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
              data: {},
              message: "Email " + req.body.email + '" is already taken',
              isSuccess: false
            });
        }else{
          
          User.findOne(
            {
              phoneNumber: req.body.phoneNumber,
            },
      
            function (err, result) {
              if (err) console.err(err);
              if (result) {
                res
                  .json({
                    code: 400,
                    data: {},
                    message: "Phone number " + req.body.phoneNumber + '" is already taken',
                    isSuccess: false
                  });
              }

              var newUser = {
                fullName: req.body.fullName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                password: hash,
                confirmPassword: hash,
                createDate: date,
              };

              User.create(newUser)
                .then(
                  (user) => {
                    console.log("User has been Added ", user);
                    res.statusCode = 200;
                    
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                      code: 200,
                      data: user,
                      message: "Account created successfully",
                      isSuccess: true
                    });
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
      isSuccess: false,
      data: {}
    });
  }
}

exports.getUserData = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      res.json({
        code: 404,
        data: {},
        message: "unable to retrieve data",
        isSuccess: false
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
      user.confirmPassword = undefined;

      response.code = 200;
      response.isSuccess = true;
      response.message = 'Refreshed';
      response.accessToken = accessToken;
      response.data = user;
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
  let hashPassword = bcrypt.hashSync(req.body.password, 10);

  User.findById(req.params.id, (err, user, data) => {
    console.log("this is the user", user);
    if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
      console.log(user.password);

      User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { password: hashPassword, confirmPassword: hashPassword } },
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
