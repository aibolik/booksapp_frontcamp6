const jwt = require('jsonwebtoken');

const checkJwtToken = (req, res, next) => {
  let authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(403).json({
      success: false,
      message: 'No authorization header provided'
    });
    return;
  }
  let token = authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, 'frontcamp', (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
}

module.exports = checkJwtToken;