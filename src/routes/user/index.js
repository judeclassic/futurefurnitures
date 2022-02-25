const express = require('express');
const router = express.Router();
const userEntry = require('../../controllers/user');
const emailEntry = require('../../controllers/subscribe');
const authenticateToken = require('../../lib/authenticate');

//User Login
router.post(
  "/signIn",
  userEntry.login
);

// User Logout
router.get(
  "/logOut",
  userEntry.logOut
);

//User Signup
router.post(
  "/signUp",
  userEntry.addUser
);

router.post(
  "/getUserData",
  userEntry.getUserData
);

//Get USer
// router.get(
//   "/api/user/getuser:id",
//   authenticateToken,
//   userEntry.getUser
// );


module.exports = router;