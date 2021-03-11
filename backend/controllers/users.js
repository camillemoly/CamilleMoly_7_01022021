const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const numberValidator = new RegExp(/\d/);
const symbolsValidator = new RegExp(/^[^@&"()!_$*€£`+=\/;?#]+$/);
const whitespaceValidator = new RegExp(/^\s+$/);
const fs = require("fs");

/** GET ONE USER
 * This function searches an user with his id,
 * returns an error if the id doesn't match to any user
 * otherwise returns the user found
 */
exports.getOneUser = (req, res) => {
  models.users.findOne({ where: { id: req.params.id } })

    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Aucun utilisateur ne correspond à cet identifiant !" });
      } else {
        const userFound = {
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture: user.profile_picture,
          about: user.about
        }
        return res.status(200).json(userFound);
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

/** MODIFY A USER
 * This function checks if the request contains a file or not,
 * if so, it deletes old profile picture to replace it by the new one
 * if not, it doesn't delete old profile picture
 * then it updates the user profile,
 * otherwise it returns an error if a field doesn't match
 */
exports.modifyUser = (req, res) => {
  const userObject = req.file ? // check if the request contains a file
  {
    ...JSON.parse(req.body.user),
    profile_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...JSON.parse(req.body.user) }
  models.users.findOne({ where: { id: req.params.id } })
  
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Modification impossible, cet utilisateur n'existe pas !" });
      } else if (!userObject.first_name || !userObject.last_name) {
        return res.status(401).json({ error: "Les champs nom et prénom sont requis !" });
      } else if (whitespaceValidator.test(userObject.first_name) || whitespaceValidator.test(userObject.last_name)) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir uniquement des espaces !" });
      } else if (numberValidator.test(userObject.first_name) || numberValidator.test(userObject.last_name)) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de chiffres !" });
      } else if (!symbolsValidator.test(userObject.first_name) || !symbolsValidator.test(userObject.last_name)) {
        return res.status(401).json({ error: "Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !" });
      } else if (req.file) {
        const filename = user.profile_picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          user.update({
            ...userObject
          })
          return res.status(201).json({ message: "Profil modifié avec succès !" })
        })
      } else {
        user.update({
          ...userObject
        })
        return res.status(201).json({ message: "Profil modifié avec succès !" })
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

/** DELETE A USER
 * This function searches all the likes of an user and deletes them,
 * then it searches all the comments of an user and deletes them,
 * then it searches all the posts of an user and deletes them (with the pictures),
 * then it deletes the user's profile picture and his account
 */
// Delete a post TODO: TROUVER COMMENT SUPPRIMER SON PROPRE PROFIL
exports.deleteUser = (req, res) => {
  models.likes.findAll({ where: { user_id: req.params.id } })
  .then(likes => {
    if (likes == "") {
      return models.comments.findAll({ where: { user_id: req.params.id } })
    } else {
      for(let like in likes) {
        likes[like].destroy()
      }
      return models.comments.findAll({ where: { user_id: req.params.id } })
    }
  })

  .then(comments => {
    if (comments == "") {
      return models.posts.findAll({ where: { user_id: req.params.id } })
    } else {
      for(let comment in comments) {
        comments[comment].destroy()
      }
      return models.posts.findAll({ where: { user_id: req.params.id } })
    }
  })

  .then(posts => {
    if (posts == "") {
      return models.users.findOne({ where: { id: req.params.id } })
    } else {
      for(let post in posts) {
        if (posts[post].post_picture) {
          const filename = posts[post].post_picture.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
          posts[post].destroy()
          })
        } else {
          posts[post].destroy()
        }
      }
      return models.users.findOne({ where: { id: req.params.id } })
    }
  })

  .then(user => {
    if (!user) {
      return res.status(404).json({ error: "Suppression impossible, cet utilisateur n'existe pas !" });
    }
    if (user.profile_picture) { // if the user has a profile picture, delete it
      const filename = user.profile_picture.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        user.destroy()
        return res.status(200).json({ message: "Utilisateur supprimé !" })
      })
    } else if (user || user.profile_picture == "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=6&m=1223671392&s=612x612&w=0&h=5VMcL3a_1Ni5rRHX0LkaA25lD_0vkhFsb1iVm1HKVSQ=") {
      user.destroy()
      return res.status(200).json({ message: "Utilisateur supprimé !" })
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};