const sequelize = require("../db-connection/db-connection");
// const { Op } = require("sequelize");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const numberValidator = new RegExp(/\d/);
const symbolsValidator = new RegExp(/^[^@&"()!_$*€£`+=\/;?#]+$/);
const whitespaceValidator = new RegExp(/^\s+$/);
const fs = require("fs");

// Get one user
exports.getOneUser = (req, res, next) => {
  models.users.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "Aucun utilisateur ne correspond à cet identifiant !" });
      }
      const userFound = {
        ...req.body // user_id, first_name, last_name
      };
      res.status(200).json(userFound);
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modify a user
exports.modifyUser = (req, res, next) => {
  models.users.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Modification impossible, cet utilisateur n'existe pas !" });
      } else if (!req.body.first_name || !req.body.last_name) {
        return res.status(401).json({ error: "Les champs nom et prénom sont requis !" });
      } else if (whitespaceValidator.test(req.body.first_name) === true || whitespaceValidator.test(req.body.last_name) === true) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir uniquement des espaces !" });
      } else if (numberValidator.test(req.body.first_name) === true || numberValidator.test(req.body.last_name) === true) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de chiffres !" });
      } else if (symbolsValidator.test(req.body.first_name) === false || symbolsValidator.test(req.body.last_name) === false) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !" });
      }
      user.update({
        ...req.body //first_name, last_name, profile_picture, about
      })
        .then(() => res.status(201).json({ message: "Profil modifié avec succès !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Delete a user
exports.deleteUser = (req, res, next) => {
  models.users.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Suppression impossible, cet utilisateur n'existe pas !" });
      }
      user.destroy()
        .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};