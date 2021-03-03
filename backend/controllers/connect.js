// Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sequelize = require("../db-connection/db-connection");
var initModels = require("../models/init-models");
var models = initModels(sequelize);

// Validators
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .symbols(1)
  .has()
  .not()
  .spaces();
const numberValidator = new RegExp(/\d/);
const symbolsValidator = new RegExp(/^[^@&"()!_$*€£`+=\/;?#]+$/);
const whitespaceValidator = new RegExp(/^\s+$/);

// Signup
exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
    return res.status(401).json({ error: "Tous les champs sont requis !" });
  } else if (whitespaceValidator.test(req.body.first_name) === true || whitespaceValidator.test(req.body.last_name) === true) {
    return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir uniquement des espaces !" });
  } else if (numberValidator.test(req.body.first_name) === true || numberValidator.test(req.body.last_name) === true) {
    return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de chiffres !" });
  } else if (symbolsValidator.test(req.body.first_name) === false || symbolsValidator.test(req.body.last_name) === false) {
    return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !" });
  } else if (emailValidator.validate(req.body.email) === false) {
    return res.status(401).json({ error: "Email non valide !" });
  } else if (passwordSchema.validate(req.body.password) === false) {
    return res.status(401).json({ error: "Mot de passe incorrect ! Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un symbole." });
  }
  models.users.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        return res.status(401).json({ error: "Cet email est déjà associé à un compte." });
      } else if (!user) {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => {
            const user = models.users.create({
              email: String(req.body.email),
              password: String(hash),
              first_name: String(req.body.first_name),
              last_name: String(req.body.last_name),
              // define a default profile picture
              profile_picture: String("https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=6&m=1223671392&s=612x612&w=0&h=5VMcL3a_1Ni5rRHX0LkaA25lD_0vkhFsb1iVm1HKVSQ="),
              // define an empty about to prevent it from displaying null 
              about: String("")
            });
            res.status(201).json({ message: "Compte utilisateur créé !" });
          })
          .catch((error) => res.status(500).json({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Login
exports.login = (req, res, next) => {
  models.users.findOne({ where: { email: req.body.email } }) // check if the email corresponds to an account
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "Aucun compte ne correspond à l'email renseigné !" });
      }
      bcrypt.compare(req.body.password, user.password) // compare password with the account password
        .then((valid) => {
          if (!valid) {
            res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({ // return user_id, token (expire in 24h) and message
            user_id: user.id,
            token: jwt.sign(
              { user_id: user.id },
              process.env.SECRET_KEY,
              { expiresIn: "24h" }
            ),
            message: "Utilisateur connecté !"
          });
        })
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};