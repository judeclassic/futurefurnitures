const express = require('express');
const router = express.Router();
const userEntry = require('../../controllers/user');
const emailEntry = require('../../controllers/subscribe');
const authenticateToken = require('../../lib/authenticate');

//Subscribe Email
router.post(
  "/subscribe",
  emailEntry.subscribe
);

//Unsubscribe Email
router.post(
  "/unsubscribe",
  emailEntry.unsubscribe
);

//User Login
router.post(
  "/login",
  userEntry.login
);

// User Logout
router.get(
  "/logout",
  userEntry.logOut
);

//User Signup
router.post(
  "/signup",
  userEntry.addUser
);

//Get USer
// router.get(
//   "/api/user/getuser:id",
//   authenticateToken,
//   userEntry.getUser
// );


module.exports = router;