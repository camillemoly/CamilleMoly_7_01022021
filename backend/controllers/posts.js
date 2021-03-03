const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const moment = require("moment");
const fs = require("fs");

// Get all posts
exports.getAllPosts = (req, res, next) => {
  models.posts.findAll({ order: [[ "id", "DESC" ]] }) // TODO: findAndCountAll method to use limit and pagination
    .then((posts) => {
      if (!posts) {
        res.status(404).json({ error: "Aucun post trouvé !" });
      }
      res.status(200).json(posts);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Get all posts of a user
exports.getAllPostsOfUser = (req, res, next) => {
  models.posts.findAll({ where: { user_id: req.params.user_id }, order: [[ "id", "DESC" ]] }) // sort by post date in descending order
    .then((posts) => {
      if (!posts) {
        res.status(404).json({ error: "Aucun post trouvé pour cet utilisateur !" });
      }
      res.status(200).json(posts);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Get one post
exports.getOnePost = (req, res, next) => {
  models.posts.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        res.status(404).json({ error: "Le post recherché n'existe pas !" });
      }
      res.status(200).json(post);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Create a post
exports.createPost = (req, res, next) => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  const postObject = req.file ? // check if the request contains a file
    {
      ...JSON.parse(req.body.post),
      post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) }
  models.users.findOne({ where: { id: postObject.user_id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Création de post impossible, cet utilisateur n'existe pas !" });
      } else if (!postObject.content) {
        return res.status(401).json({ error: "Un post doit contenir du texte !" });
      }
      const post = models.posts.create({
        ...postObject, // user_id, content, post_picture
        date: date
      })
        .then(() => res.status(201).json({ message: "Post créé !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Modify a post
exports.modifyPost = (req, res, next) => {
  const postObject = req.file ?
    {
      ...JSON.parse(req.body.post),
      post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) }
  models.posts.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Modification impossible, ce post n'existe pas !" });
      } else if (!postObject.content) {
        return res.status(401).json({ error: "Un post doit contenir du texte !" });
      } else if (post.post_picture && req.file) {
        // if the post already contains a picture and the request contains a file, delete old post picture to replace it by the new one
        const filename = post.post_picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          post.update({
            ...postObject
          })
          .then(() => res.status(201).json({ message: "Post modifié avec succès !" }))
          .catch((error) => res.status(500).json({ message: error.message }));
        })
      } else {
        post.update({
          ...postObject
        })
        .then(() => res.status(201).json({ message: "Post modifié avec succès !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Delete a post
exports.deletePost = (req, res, next) => {
  models.posts.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Suppression impossible, ce post n'existe pas !" });
      }
      if(post.post_picture) { // if the post contains a picture, delete it
        const filename = post.post_picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          post.destroy()
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(500).json({ message: error.message }));
        })
      } else {
        post.destroy()
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(500).json({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Like a post
exports.likePost = (req, res, next) => {
  models.users.findOne({ where: { id: req.body.user_id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Like impossible, cet utilisateur n'existe pas !" });
      }
      models.posts.findOne({ where: { id: req.body.post_id } })
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: "Like impossible, ce post n'existe pas !" });
          }
          const like = models.likes.create({
            ...req.body //user_id, post_id
          })
            .then(() =>res.status(201).json({ message: "Publication likée !" }))
            .catch((error) => res.status(500).json({ message: error.message }));
        })
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Unlike a post
exports.unlikePost = (req, res, next) => {
  models.likes.findOne({ where: { id: req.params.id } })
    .then((like) => {
      if (!like) {
        return res.status(404).json({ error: "Annulation impossible, ce like n'existe pas !" });
      }
      like.destroy()
        .then(() => res.status(200).json({ message: "Like annulé !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Comment a post
exports.commentPost = (req, res, next) => {
  models.users.findOne({ where: { id: req.body.user_id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Commentaire impossible à ajouter, cet utilisateur n'existe pas !" });
      }
      models.posts.findOne({ where: { id: req.body.post_id } })
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: "Commentaire impossible à ajouter, ce post n'existe pas !" });
          } else if (!req.body.content) {
            return res.status(401).json({ error: "Un commentaire ne peut pas être vide !" });
          }
          const comment = models.comments.create({
            ...req.body //user_id, post_id, content
          })
            .then(() => res.status(201).json({ message: "Commentaire ajouté !" }))
            .catch((error) => res.status(500).json({ message: error.message }));
        })
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Modify comment of a post
exports.modifyCommentPost = (req, res, next) => {
  models.comments.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ error: "Modification impossible, ce commentaire n'existe pas !" });
      } else if (!req.body.content) {
        return res.status(401).json({ error: "Un commentaire ne doit pas être vide !" });
      }
      comment.update({
        ...req.body // content
      })
        .then(() => res.status(201).json({ message: "Commentaire modifié !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

// Delete comment of a post
exports.deleteCommentPost = (req, res, next) => {
  models.comments.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ error: "Suppression impossible, ce commentaire n'existe pas !" });
      }
      comment.destroy()
        .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
        .catch((error) => res.status(500).json({ message: error.message }));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};