const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // decode the token (object) with secretKey randomly generated
      const user_id = decodedToken.user_id; // take userId of decodedToken object
      if (req.body.user_id && req.body.user_id !== user_id) { // compare req userId and userId decoded of token
        throw 'ID utilisateur invalide !';
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Requête invalide !')
      });
    }
  };