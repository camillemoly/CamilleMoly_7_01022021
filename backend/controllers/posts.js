// Imports
const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const moment = require("moment");
const fs = require("fs");

/******************** USER CHECK ******************** /
 * Returns the user_id of the token sent from the frontend
 */
const userIdCheck = (req) => {
  return req.user.user_id;
}
/******************** USER CHECK ******************** /
 * Returns the is_admin of the token sent from the frontend
 */
const isAdminCheck = (req) => {
  return req.user.is_admin;
}
/******************** GET PAGINATION ******************** /
 * Defines what the limit and offset params correspond to
 * and defines their default value
 */
const getPagination = (page, size) => {
  const limit = size ? +size : 2;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
/******************** GET PAGING DATA ******************** /
 * Defines others names for count and rows
 * and defines values for currentPage and totalPages
 */
const getPagingData = (data, page, limit) => {
  const { count: totalPosts, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalPosts / limit);
  return { totalPosts, posts, totalPages, currentPage };
};


/******************** GET ALL POSTS ******************** /
 * Retrieves page and size from req queries and defines limit and offset values from them
 * Searches for posts with these params, order posts by their date and id
 * Checks also if there is user_id in req queries, if so, filters posts with these user_id
 * Then returns the posts
 */
exports.getAllPosts = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  models.posts.findAndCountAll({ 
    limit: limit,
    offset: offset,
    order: [[ "date", "DESC" ], [ "id", "DESC" ]],
    where: req.query.user_id ? { user_id: req.query.user_id } : {}
  })

  .then(posts => {
    if (!posts) {
      return res.status(404).json({ error: "Aucun post trouvé !" });
    } else {
      const response = getPagingData(posts, page, limit)
      return res.status(200).json(response);
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};


/******************** CREATE POST ******************** /
 * Gets the current date
 * Checks if user sent post_picture or not and defines postObject value
 * Then checks if the user_id corresponds to an existing user
 * And creates a new post with postObject content and date
 */
exports.createPost = (req, res) => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  const postObject = req.file ?
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


/******************** MODIFY POST ******************** /
 * Checks if the request contain a post picture or not, then defines postObject value
 * Then it searches for the post with the id of req params
 * Then it checks that the user who wants to modify the post is the one who created it or that it's the admin account
 * Then it checks if request doesn't contain others errors, if so, returns error, if not, update the post
 */
exports.modifyPost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  const postObject = req.file ?
    {
      ...JSON.parse(req.body.post),
      post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) }
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    // Checks that the user who wants to modify the post is the one who created it or that it's the admin account
    if (post.user_id !== userIdToken && isAdminToken == false) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de modification pour ce post !" });
    } else if (!post) {
      return res.status(404).json({ error: "Modification impossible, ce post n'existe pas !" });
    } else if (!postObject.content) {
      return res.status(401).json({ error: "Un post doit contenir du texte !" });
    } else if (post.post_picture && req.file) {
    // If the post contains a picture and the request contains a file, delete old pic and replace it by the new one
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


/******************** DELETE POST ******************** /
 * Checks that the user who wants to delete the post is the one who created it or that it's the admin account
 * Then it searches for the likes of the post and delete them (if there are any)
 * Then it searches for the comments of the post and delete them (if there are any)
 * Then it searches for the post by its id, if contains a picture delete it, then delete the post
 */
exports.deletePost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (post.user_id !== userIdToken && isAdminToken == false) {
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


/******************** GET ALL LIKES OF A POST ******************** /
 * Checks if the post with this id exists or not,
 * If so, find all likes for this post
 */
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


/******************** LIKE POST ******************** /
 * Checks if the user who likes the post exists
 * Then checks if the post exists
 * Then creates the like for this post 
 */
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


/******************** UNLIKE POST ******************** /
 * Searches for the like with this user_id and post_id, and if exists, delete it 
 */
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


/******************** GET ALL COMMENTS OF A POST ******************** /
 * Checks if the post exists, then searches all of comments of this post
 */
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


/******************** COMMENT POST ******************** /
 * Checks if the user exists, then searches for the post with the id of req params,
 * If the post exists, create a new comment for it
 */
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


/******************** MODIFY COMMENT POST ******************** /
 * Checks if the post exists, then checks that the user who wants to modify the comment
 * is the one who created it or that it's the admin account
 * Then updates the comment
 */
exports.modifyCommentPost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Modification impossible, ce post n'existe pas !" });
    } else {
      return models.comments.findOne({ where: { id: req.params.comment_id } })
    }
  })

  .then(comment => {
    if (comment.user_id !== userIdToken && isAdminToken == false) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de modifications pour ce commentaire !" });
    } else if (!comment) {
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


/******************** DELETE COMMENT POST ******************** /
 * Checks if the post exists, then checks that the user who wants to delete the comment
 * is the one who created it or that it's the admin account
 * Then deletes the comment
 */
exports.deleteCommentPost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (!post) {
      return res.status(404).json({ error: "Suppression impossible, ce post n'existe pas !" });
    } else {
      return models.comments.findOne({ where: { id: req.params.comment_id } })
    }
  })

  .then(comment => {
    if (comment.user_id !== userIdToken && isAdminToken == false) {
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de suppression pour ce commentaire !" });
    } else if (!comment) {
      return res.status(404).json({ error: "Suppression impossible, ce commentaire n'existe pas !" });
    } else {
      comment.destroy()
      return res.status(200).json({ message: "Commentaire supprimé !" })
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};