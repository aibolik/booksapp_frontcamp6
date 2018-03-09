const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req, res) => {
  let { username, password } = req.body;

  let user = await User.findOne({ username });

  if (user === undefined || user.password !== password) {
    res.status(403).json({
      success: false,
      message: 'Bad username or password'
    });
  } else {
    let payload = { sub: user._id, name: user.name };
    let token = jwt.sign(payload, 'frontcamp');
    res.status(200).json({ token });
  }
};

module.exports = authentication;