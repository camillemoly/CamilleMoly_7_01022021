/*********************************** IMPORTS ***********************************/

const sequelize = require("../db-connection/db-connection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const moment = require("moment");
const fs = require("fs");

const userIdCheck = (req) => {
  return req.user.user_id;
}
const isAdminCheck = (req) => {
  return req.user.is_admin;
}


/********************************* PAGINATION **********************************/

/**
 * This function will accept queries from frontend,
 * and defines limit and offset from them
 *
 * @param   {Number}  page  The current page
 * @param   {Number}  size  How many item are fetched per page
 *
 * @return  {Object}        Limit and offset clauses
 */
const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

/**
 * This function will accept the data returned by the server, page and limit from frontend
 * and returns object response with these values
 *
 * @param   {Object}  data   The data returned by the server
 * @param   {Number}  page   The current page
 * @param   {Number}  limit  How many item are fetched per page
 *
 * @return  {Object}         Object response with posts data and detail fo pagination
 */
const getPagingData = (data, page, limit) => {
  const { count: totalPosts, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalPosts / limit);
  return { totalPosts, posts, totalPages, currentPage };
};


/******************************* POSTS CONTROLLERS *******************************/

/**
 * This function will accept request
 * and get all posts from the database
 *
 * @param   {Object}  req  The queries of request
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with response (contains posts, total posts number, current page, total page number)
 */
exports.getAllPosts = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  models.posts.findAndCountAll({ 
    limit: limit,
    offset: offset,
    order: [[ "date", "DESC" ], [ "id", "DESC" ]],
    where: req.query.user_id ? { user_id: req.query.user_id } : {} // if query contains user_id, search for posts with this id
  })

  .then(posts => {
    if (!posts) {
      return res.status(404).json({ error: "Aucun post trouvé !" });
    } else {
      const response = getPagingData(posts, page, limit) // return posts with totalPosts number, totalPages number and currentPage
      return res.status(200).json(response);
    }
  })

  .catch(error => res.status(500).json({ message: error.message }));
};

/**
 * This function will accept request
 * and create new post in the database
 *
 * @param   {FormData}  req  The post's information and its post_picture (in body)
 * @param   {Object}    res  The function result
 *
 * @return  {Object}         Success status with message
 */
exports.createPost = (req, res) => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  const postObject = req.file ? // checks if user create a post with a file
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

  .catch(error => res.status(500).json({ message: error.message }));e
};

/**
 * This function will accept request
 * and update the post in the database
 *
 * @param   {FormData}  req  The post's information only or with its post_picture (in body), and its id (in params)
 * @param   {Object}    res  The function result
 *
 * @return  {Object}         Success status with message
 */
exports.modifyPost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  const postObject = req.file ? // checks if user modify the post with a file
    {
      ...JSON.parse(req.body.post),
      post_picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.post) }
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (post.user_id !== userIdToken && isAdminToken == false) { // only the owner of the post and admin can modify the post
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

/**
 * This function will accept request
 * and delete post's likes, comments, and post in the database
 *
 * @param   {Object}  req  The post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
 */
exports.deletePost = (req, res) => {
  const userIdToken = userIdCheck(req);
  const isAdminToken = isAdminCheck(req);
  models.posts.findOne({ where: { id: req.params.id } })

  .then(post => {
    if (post.user_id !== userIdToken && isAdminToken == false) { // only the owner of the post and admin can delete the post
      return res.status(401).json({ error: "L'utilisateur ne dispose pas des droits de suppression pour ce post !" });
    } else {
      return models.likes.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(likes => {
    if (likes == "") {
      return models.comments.findAll({ where: { post_id: req.params.id } })
    } else { // if post has likes, delete them
      for(let like in likes) {
      likes[like].destroy()
      }
      return models.comments.findAll({ where: { post_id: req.params.id } })
    }
  })

  .then(comments => { // if post has comments, delete them
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

/**
 * This function will accept request
 * and search for all likes for the post with its id
 *
 * @param   {Object}  req  The post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       The likes object with success status
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

/**
 * This function will accept request
 * and create like for the post with this id
 *
 * @param   {Object}  req  The post id (in params) and user_id (in body)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
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

/**
 * This function will accept request
 * and delete like for the post with this id
 *
 * @param   {Object}  req  The post id (in params) and user_id (in body)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
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

/**
 * This function will accept request
 * and search for all comments for the post with its id
 *
 * @param   {Object}  req  The post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       The comments object with success status
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

/**
 * This function will accept request
 * and create new comment in the database
 *
 * @param   {Object}  req  The comment's information (in body) and post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
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

/**
 * This function will accept request
 * and update the comment in the database
 *
 * @param   {Object}  req  The comment's information (in body) and post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
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
    if (comment.user_id !== userIdToken && isAdminToken == false) { // only the owner of the comment and admin can modify the comment
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

/**
 * This function will accept request
 * and delete the comment in the database
 *
 * @param   {Object}  req  The comment id and post id (in params)
 * @param   {Object}  res  The function result
 *
 * @return  {Object}       Success status with message
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
    if (comment.user_id !== userIdToken && isAdminToken == false) { // only the owner of the comment and admin can delete the comment
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