const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // decode the token (object) with secretKey randomly generated
    const userId = decodedToken.user_id; // take userId of decodedToken object
    if (req.body.user_id && req.body.user_id !== userId) {
      // compare req userId and userId decoded of token
      return res.status(401).json({ error: "Identifiant d'utilisateur invalide !" });
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: "Requête invalide !" });
  }
};