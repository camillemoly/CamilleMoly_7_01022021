const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const moment = require("moment");

// Get all posts
exports.getAllPosts = (req, res, next) => {
  models.posts
    .findAll()
    .then((posts) => {
      if (!posts) {
        res.status(404).json({ error: "Aucun post trouvé !" });
      }
      res.status(200).json(posts);
    })
    .catch((error) => res.status(500).json({ error }));
};

// Get one post
exports.getOnePost = (req, res, next) => {
  models.posts
    .findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        res.status(404).json({ error: "Le post recherché n'exite pas !" });
      }
      res.status(200).json(post);
    })
    .catch((error) => res.status(500).json({ error }));
};

// Create a post
exports.createPost = (req, res, next) => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  models.users
    .findOne({ where: { id: req.body.user_id } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({
            error:
              "Création de post impossible, cet utilisateur n'existe pas !",
          });
      } else if (!req.body.content) {
        return res
          .status(401)
          .json({ error: "Un post doit contenir du texte !" });
      }
      const post = models.posts
        .create({
          user_id: req.body.user_id,
          date: date,
          content: req.body.content,
          post_picture: req.body.post_picture,
        })
        .then(() => res.status(201).json({ message: "Post créé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modify a post
exports.modifyPost = (req, res, next) => {
  models.posts
    .findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ error: "Modification impossible, ce post n'existe pas !" });
      } else if (!req.body.content) {
        return res
          .status(401)
          .json({ error: "Un post doit contenir du texte !" });
      }
      post
        .update({
          content: req.body.content,
          post_picture: req.body.post_picture,
        })
        .then(() => res.status(201).json({ message: "Post modifié !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Delete a post
exports.deletePost = (req, res, next) => {
  models.posts
    .findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ error: "Suppression impossible, ce post n'existe pas !" });
      }
      post
        .destroy()
        .then(() => res.status(200).json({ message: "Post supprimé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Like a post
exports.likePost = (req, res, next) => {
  models.users
    .findOne({ where: { id: req.body.user_id } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ error: "Like impossible, cet utilisateur n'existe pas !" });
      }
      models.posts
        .findOne({ where: { id: req.body.post_id } })
        .then((post) => {
          if (!post) {
            return res
              .status(404)
              .json({ error: "Like impossible, ce post n'existe pas !" });
          }
          const like = models.likes
            .create({
              user_id: req.body.user_id,
              post_id: req.body.post_id,
            })
            .then(() =>
              res.status(201).json({ message: "Publication likée !" })
            )
            .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Cancel the like of a post
exports.cancelLikePost = (req, res, next) => {
  models.likes
    .findOne({ where: { id: req.params.id } })
    .then((like) => {
      if (!like) {
        return res
          .status(404)
          .json({ error: "Annulation impossible, ce like n'existe pas !" });
      }
      like
        .destroy()
        .then(() => res.status(200).json({ message: "Like annulé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Comment a post
exports.commentPost = (req, res, next) => {
  models.users
    .findOne({ where: { id: req.body.user_id } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({
            error:
              "Commentaire impossible à ajouter, cet utilisateur n'existe pas !",
          });
      }
      models.posts
        .findOne({ where: { id: req.body.post_id } })
        .then((post) => {
          if (!post) {
            return res
              .status(404)
              .json({
                error:
                  "Commentaire impossible à ajouter, ce post n'existe pas !",
              });
          } else if (!req.body.content) {
            return res
              .status(401)
              .json({ error: "Un commentaire ne peut pas être vide !" });
          }
          const comment = models.comments
            .create({
              user_id: req.body.user_id,
              post_id: req.body.post_id,
              content: req.body.content,
            })
            .then(() =>
              res.status(201).json({ message: "Commentaire ajouté !" })
            )
            .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modify comment of a post
exports.modifyCommentPost = (req, res, next) => {
  models.comments
    .findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res
          .status(404)
          .json({
            error: "Modification impossible, ce commentaire n'existe pas !",
          });
      } else if (!req.body.content) {
        return res
          .status(401)
          .json({ error: "Un commentaire ne doit pas être vide !" });
      }
      comment
        .update({
          content: req.body.content,
        })
        .then(() => res.status(201).json({ message: "Commentaire modifié !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Delete comment of a post
exports.deleteCommentPost = (req, res, next) => {
  models.comments
    .findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res
          .status(404)
          .json({
            error: "Suppression impossible, ce commentaire n'existe pas !",
          });
      }
      comment
        .destroy()
        .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};