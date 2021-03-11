const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const moment = require("moment");
const fs = require("fs");
const userCheck = (req) => {
  return req.user.user_id;
}

// Get all posts
exports.getAllPosts = (req, res) => {
  models.posts.findAll({ order: [[ "id", "DESC" ]] }) // TODO: findAndCountAll method to use limit and pagination

    .then(posts => {
      if (!posts) {
        return res.status(404).json({ error: "Aucun post trouvé !" });
      } else {
        return res.status(200).json(posts);
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Get all posts of a user
exports.getAllPostsOfUser = (req, res) => {
  models.posts.findAll({ where: { user_id: req.params.user_id }, order: [[ "id", "DESC" ]] }) // sort by post date in descending order

    .then(posts => {
      if (!posts) {
        return res.status(404).json({ error: "Aucun post trouvé pour cet utilisateur !" });
      } else {
        return res.status(200).json(posts);
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Create a post
exports.createPost = (req, res) => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  const postObject = req.file ? // check if the request contains a file
    {
      ...JSON.parse(req.body.post),
      post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) }
  models.users.findOne({ where: { id: postObject.user_id } })

    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Création de post impossible, cet utilisateur n'existe pas !" });
      } else if (!postObject.content) {
        return res.status(401).json({ error: "Un post doit contenir du texte !" });
      } else {
        const post = models.posts.create({
          ...postObject, // user_id, content, post_picture
          date: date
        })
        return res.status(201).json({ message: "Post créé !" })
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Modify a post
exports.modifyPost = (req, res) => {
  let postObject;
  const userIdToken = userCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (post.user_id !== userIdToken && userIdToken !== 74) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de modification pour ce post !" });
    } else {
      postObject = req.file ?
      {
        ...JSON.parse(req.body.post),
        post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...JSON.parse(req.body.post) }
      return models.posts.findOne({ where: { id: req.params.id } })
    }
  })

  .then(post => {
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
          return res.status(201).json({ message: "Post modifié avec succès !" })
        })
    } else {
      post.update({
        ...postObject
      })
      return res.status(201).json({ message: "Post modifié avec succès !" })
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};

// Delete a post
exports.deletePost = (req, res) => {
  const userIdToken = userCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (post.user_id !== userIdToken && userIdToken !== 74) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de suppression pour ce post !" });
    } else {
      return models.likes.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(likes => {
    if (likes == "") {
      return models.comments.findAll({ where: { post_id: req.params.id } })
    } else {
      for(let like in likes) {
        likes[like].destroy()
      }
      return models.comments.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(comments => {
    if (comments == "") {
      return models.posts.findOne({ where: { id: req.params.id } })
    } else {
      for(let comment in comments) {
        comments[comment].destroy()
      }
      return models.posts.findOne({ where: { id: req.params.id } })
    }
  })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Suppression impossible, ce post n'existe pas !" });
    }
    if (post.post_picture) { // if the post contains a picture, delete it
      const filename = post.post_picture.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        post.destroy()
        return res.status(200).json({ message: "Post supprimé !" })
      })
    } else {
      post.destroy()
      return res.status(200).json({ message: "Post supprimé !" })
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};

// Get all likes of a post
exports.getAllLikesOfAPost = (req, res) => {
  models.posts.findOne({ where: { id: req.params.id } })
  .then(post => {
    if (!post) {
      return res.status(404).json({ message: "Le post n'existe pas !" });
    } else {
      return models.likes.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(likes => {
    if (!likes) {
      return res.json({ message: "Aucun like trouvé pour ce post !" });
    } else {
      return res.status(200).json(likes)
    }
  })
  
  .catch(error => res.status(500).json({ message: error.message }));
};

// Like a post
exports.likePost = (req, res) => {
  models.users.findOne({ where: { id: req.body.user_id } })

  .then(user => {
    if (!user) {
      return res.status(404).json({ error: "Like impossible, cet utilisateur n'existe pas !" });
    } else {
      return models.posts.findOne({ where: { id: req.params.id } })
    }
  })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Like impossible, ce post n'existe pas !" });
    } else {
      const like = models.likes.create({
        post_id: req.params.id,
        user_id: req.body.user_id
      })
      return res.status(201).json({ message: "Publication likée !" })
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};

// Unlike a post
exports.unlikePost = (req, res) => {
  models.likes.findOne({ where: { post_id: req.params.id, user_id: req.body.user_id } })

    .then(like => {
      if (!like) {
        return res.status(404).json({ error: "Annulation impossible, ce like n'existe pas !" });
      } else {
        like.destroy()
        return res.status(200).json({ message: "Like annulé !" })
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Get all comments of a post
exports.getAllCommentsOfAPost = (req, res) => {
  models.posts.findOne({ where: { id: req.params.id } })
  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Le post n'existe pas" });
    } else {
      return models.comments.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(comments => {
    if (!comments) {
      return res.status(404).json({ error: "Le post ne contient aucun commentaire !" });
    } else {
      return res.status(200).json(comments)
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
  
};

// Comment a post
exports.commentPost = (req, res) => {
  models.users.findOne({ where: { id: req.body.user_id } })

    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Commentaire impossible à ajouter, cet utilisateur n'existe pas !" });
      } else {
        return models.posts.findOne({ where: { id: req.params.id } })
      }
    })

    .then(post => {
      if (!post) {
        return res.status(404).json({ error: "Commentaire impossible à ajouter, ce post n'existe pas !" });
      } else if (!req.body.content) {
        return res.status(401).json({ error: "Un commentaire ne peut pas être vide !" });
      } else {
        const comment = models.comments.create({
          user_id: req.body.user_id,
          post_id: req.params.id,
          content: req.body.content
        })
        return res.status(201).json({ message: "Commentaire ajouté !" })
      }
    })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Modify comment of a post
exports.modifyCommentPost = (req, res) => {
  const userIdToken = userCheck(req);
  models.comments.findOne({ where: { id: req.params.comment_id } })

  .then(comment => {
    if (comment.user_id !== userIdToken && userIdToken !== 74) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de modifications pour ce commentaire !" });
    } else {
      return models.posts.findOne({ where: { id: req.params.id } })
    }
  })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Modification impossible, ce post n'existe pas !" });
    } else {
      return models.comments.findOne({ where: { id: req.params.comment_id } })
    }
  })

  .then(comment => {
    if (!comment) {
      return res.status(404).json({ error: "Modification impossible, ce commentaire n'existe pas !" });
    } else if (!req.body.content) {
      return res.status(401).json({ error: "Un commentaire ne doit pas être vide !" });
    } else {
      comment.update({
        content: req.body.content
      })
      return res.status(201).json({ message: "Commentaire modifié !" })
    }
  })

    .catch(error => res.status(500).json({ message: error.message }));
};

// Delete comment of a post
exports.deleteCommentPost = (req, res) => {
  const userIdToken = userCheck(req);
  models.comments.findOne({ where: { id: req.params.comment_id } })

  .then(comment => {
    if (comment.user_id !== userIdToken && userIdToken !== 74) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de suppression pour ce commentaire !" });
    } else {
      return models.posts.findOne({ where: { id: req.params.id } })
    }
  })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Suppression impossible, ce post n'existe pas !" });
    } else {
      return models.comments.findOne({ where: { id: req.params.comment_id } })
    }
  })

  .then(comment => {
    if (!comment) {
      return res.status(404).json({ error: "Suppression impossible, ce commentaire n'existe pas !" });
    } else {
      comment.destroy()
      return res.status(200).json({ message: "Commentaire supprimé !" })
    }
  })

    .catch(error => res.status(500).json({ message: error.message }));
};