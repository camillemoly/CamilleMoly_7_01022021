const sequelize = require("../db-connection/db-connection");
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
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture,
        about: user.about
      }
      res.status(200).json(userFound);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Modify a user
exports.modifyUser = (req, res, next) => {
    const userObject = req.file ? // check if the request contains a file
    {
      ...JSON.parse(req.body.user),
      profile_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.user) }
  models.users.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Modification impossible, cet utilisateur n'existe pas !" });
      } else if (!userObject.first_name || !userObject.last_name) {
        return res.status(401).json({ error: "Les champs nom et prénom sont requis !" });
      } else if (whitespaceValidator.test(userObject.first_name) === true || whitespaceValidator.test(userObject.last_name) === true) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir uniquement des espaces !" });
      } else if (numberValidator.test(userObject.first_name) === true || numberValidator.test(userObject.last_name) === true) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de chiffres !" });
      } else if (symbolsValidator.test(userObject.first_name) === false || symbolsValidator.test(userObject.last_name) === false) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !" });
      } else if (req.file) { // if the request contains a file, delete old profile picture to replace it by the new one
        const filename = user.profile_picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          user.update({
            ...userObject
          })
          .then(() => res.status(201).json({ message: "Profil modifié avec succès !" }))
          .catch((error) => res.status(500).json({ message: error.message }));
        })
      } else { // if the request doesn't contain a file, don't delete old profile picture
        user.update({
          ...userObject
        })
        .then(() => res.status(201).json({ message: "Profil modifié avec succès !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Delete a user
exports.deleteUser = (req, res, next) => {
  models.users.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Suppression impossible, cet utilisateur n'existe pas !" });
      }
      const filename = user.profile_picture.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => { // delete profile picture before deleting profile
        user.destroy()
        .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
      })
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};