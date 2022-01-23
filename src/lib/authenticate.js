const jwt = require('jsonwebtoken');

exports.authenticateToken = function (req, res, next) {
    const token = req.headers["authorization"];
    if (token == null || token == undefined) {
      return res.json({
        code: 401,
        message: 'Authentication Failed'
      });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
      if (err) {
        return res.json({
          code: 403,
          message: 'Authentication Failed'
        });
      }
      req.user = user;
      next();
    });
  };
