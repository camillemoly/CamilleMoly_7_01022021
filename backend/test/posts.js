var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); //choose env file depending on the environment
let adminToken;
let userToken;

chai.use(chaiHttp);

describe("posts.js", () => {

  before("Get admin token", (done) => {
    chai
    .request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send({
      "email": process.env.ADMIN_EMAIL,
      "password": process.env.ADMIN_PASSWORD
    })
    .end((err, res) => {
      adminToken = res.body.token
      done();
    })
    return adminToken;
  })

  before("Get user token", (done) => {
    chai
    .request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send({
      "email": process.env.USER_EMAIL,
      "password": process.env.USER_PASSWORD
    })
    .end((err, res) => {
      userToken = res.body.token
      done();
    })
    return userToken;
  })

  /************************************************** GET ALL POSTS **************************************************/
  describe("GET /api/posts/all", () => {
    // 1
    it("should find all posts", (done) => {
      chai
      .request(app)
      .get("/api/posts/all")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
    });
  });

  /************************************************** CREATE POST **************************************************/
  describe("POST /api/posts", () => {
    // 1
    it("should create a post with a picture", (done) => {
      chai
      .request(app)
      .post("/api/posts")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          user_id: 56,
          content: "Hello world !"
        })
      )
      .attach("image", "./test/meme1.jpg", "meme1.jpg")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post créé !");
        done();
      });
    });
    // 2
    it("should create a post without picture", (done) => {
      chai
      .request(app)
      .post("/api/posts")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          user_id: 56,
          content: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post créé !");
        done();
      });
    });
    // 3
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .post("/api/posts")
      .set("authorization", "Bearer myTokenWhichNotExist")
      .field(
        "post", JSON.stringify({
          user_id: 2021,
          content: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Requête invalide !");
        done();
      });
    });
    // 4
    it("should generate an error because the content is empty or missing", (done) => {
      chai
      .request(app)
      .post("/api/posts")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          user_id: 56,
          content: ""
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Un post doit contenir du texte !");
        done();
      });
    });
  });

  /************************************************** MODIFY POST **************************************************/
  describe("PUT /api/posts/:id", () => {
    // 1
    it("should modify a post with a new picture", (done) => {
      chai
      .request(app)
      .put("/api/posts/36")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          content: "Hello"
        })
      )
      .attach("image", "./test/meme2.png", "meme2.png")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post modifié avec succès !");
        done();
      });
    });
    // 2
    it("should modify a post but without new picture", (done) => {
      chai
      .request(app)
      .put("/api/posts/36")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          content: "Hi"
        })
      )
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post modifié avec succès !");
        done();
      });
    });
    // 3
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .put("/api/posts/2021")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          content: "Hi"
        })
      )
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Modification impossible, ce post n'existe pas !");
        done();
      });
    });
    // 4
    it("should generate an error because the user doesn't have the rights to modify this post (not his owner or admin)", (done) => {
      chai
      .request(app)
      .put("/api/posts/36")
      .set("authorization", `Bearer ${userToken}`)
      .field(
        "post", JSON.stringify({
          content: "Hello"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de modification pour ce post !");
        done();
      });
    });
    // 5
    it("should generate an error because the content is empty or missing", (done) => {
      chai
      .request(app)
      .put("/api/posts/36")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "post", JSON.stringify({
          content: ""
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Un post doit contenir du texte !");
        done();
      });
    });
  });

  /************************************************** DELETE POST **************************************************/
  describe("DELETE /api/posts/:id", () => {
    // 1
    it.skip("should delete a post", (done) => {
      chai
      .request(app)
      .delete("/api/posts/36")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post supprimé !");
        done();
      });
    });
    // 2
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .delete("/api/posts/2021")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, ce post n'existe pas !");
        done();
      });
    });
    // 3
    it("should generate an error because the user doesn't have the rights to delete this post (not his owner or admin)", (done) => {
      chai
      .request(app)
      .delete("/api/posts/36")
      .set("authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de suppression pour ce post !");
        done();
      });
    });
  });

  /******************************************* GET ALL LIKES OF A POST *******************************************/
  describe("GET /api/posts/:id/likes/all", () => {
    // 1
    it("should get all likes of a post", (done) => {
      chai
      .request(app)
      .get("/api/posts/39/likes/all")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
    });
    // 2
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .get("/api/posts/2021/likes/all")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Le post n'existe pas !");
        done();
      });
    });
  });

  /************************************************** LIKE POST **************************************************/
  describe("POST /api/posts/:id/likes", () => {
    // 1
    it("should create a like of a post", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/likes")
      .set("Content-Type", "application/json")
      .send({
        user_id: 56
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Publication likée !");
        done();
      });
    });
    // 2
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/likes")
      .set("Content-Type", "application/json")
      .send({
        user_id: 2021
      })
      .set("authorization", `Bearer myTokenWhichNotExist`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Requête invalide !");
        done();
      });
    });
    // 3
    it("should generate an error because the user id and the token doesn't correspond", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/likes")
      .set("Content-Type", "application/json")
      .send({
        user_id: 2021
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Identifiant d'utilisateur invalide !");
        done();
      });
    });
    // 4
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .post("/api/posts/2021/likes")
      .set("Content-Type", "application/json")
      .send({
        user_id: 56
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Like impossible, ce post n'existe pas !");
        done();
      });
    });
  });

  /************************************************** UNLIKE POST **************************************************/
  describe("DELETE /api/posts/:id/likes", () => {
    // 1
    it.skip("should delete the like of the post", (done) => {
      chai
      .request(app)
      .delete("/api/posts/39/likes")
      .set("authorization", `Bearer ${adminToken}`)
      .set("Content-Type", "application/json")
      .send({ user_id: 56 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Like annulé !");
        done();
      });
    });
    // 2
    it("should generate an error because the like doesn't exist", (done) => {
      chai
      .request(app)
      .delete("/api/posts/2021/likes")
      .set("authorization", `Bearer ${adminToken}`)
      .set("Content-Type", "application/json")
      .send({ user_id: 56 })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Annulation impossible, ce like n'existe pas !");
        done();
      });
    });
  });

  /******************************************* GET ALL COMMENTS OF A POST *******************************************/
  describe("GET /api/posts/:id/comments/all", () => {
    // 1
    it("should get all comments of a post", (done) => {
      chai
      .request(app)
      .get("/api/posts/39/comments/all")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
    });
    // 2
    it("should generate an error because the post with this id doesn't exist", (done) => {
      chai
      .request(app)
      .get("/api/posts/2021/comments/all")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Le post n'existe pas !");
        done();
      });
    });
  });

  /************************************************** COMMENT POST **************************************************/
  describe("POST /api/posts/:id/comments", () => {
    // 1
    it("should comment a post", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/comments")
      .set("Content-Type", "application/json")
      .send({
        user_id: 56,
        content: "Ahahah"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Commentaire ajouté !");
        done();
      });
    });
    // 2
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/comments")
      .set("Content-Type", "application/json")
      .send({
        user_id: 2021,
        content: "Ahahah"
      })
      .set("authorization", `Bearer myTokenWhichNotExist`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Requête invalide !");
        done();
      });
    });
    // 3
    it("should generate an error because the user id and the token doesn't correspond", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/comments")
      .set("Content-Type", "application/json")
      .send({
        user_id: 2021,
        content: "Ahahah"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Identifiant d'utilisateur invalide !");
        done();
      });
    });
    // 4
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .post("/api/posts/2021/comments")
      .set("Content-Type", "application/json")
      .send({
        user_id: 56,
        content: "Ahahah"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Commentaire impossible à ajouter, ce post n'existe pas !");
        done();
      });
    });
    // 5
    it("should generate an error because the content is empty or missing", (done) => {
      chai
      .request(app)
      .post("/api/posts/39/comments")
      .set("Content-Type", "application/json")
      .send({
        user_id: 56,
        content: ""
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Un commentaire ne peut pas être vide !");
        done();
      });
    });
  });

  /************************************************** MODIFY COMMENT POST **************************************************/
  describe("PUT /api/posts/:id/comments/:comment_id", () => {
    // 1
    it("should modify a comment", (done) => {
      chai
      .request(app)
      .put("/api/posts/39/comments/59")
      .set("Content-Type", "application/json")
      .send({
        content: "Hello everybody !"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Commentaire modifié !");
        done();
      });
    });
    // 2
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .put("/api/posts/38/comments/59")
      .set("Content-Type", "application/json")
      .send({
        content: "Hello everybody !"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Modification impossible, ce post n'existe pas !");
        done();
      });
    });
    // 3
    it("should generate an error because the comment doesn't exist", (done) => {
      chai
      .request(app)
      .put("/api/posts/39/comments/2021")
      .set("Content-Type", "application/json")
      .send({
        content: "Hello everybody !"
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Modification impossible, ce commentaire n'existe pas !");
        done();
      });
    });
    // 4
    it("should generate an error because the user doesn't have the rights to modify this comment (not his owner or admin)", (done) => {
      chai
      .request(app)
      .put("/api/posts/39/comments/59")
      .set("Content-Type", "application/json")
      .send({
        content: "lol"
      })
      .set("authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de modifications pour ce commentaire !");
        done();
      });
    });
    // 5
    it("should generate an error because the content is empty or missing", (done) => {
      chai
      .request(app)
      .put("/api/posts/39/comments/59")
      .set("Content-Type", "application/json")
      .send({
        content: ""
      })
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Un commentaire ne doit pas être vide !");
        done();
      });
    });
  });

  /************************************************** DELETE COMMENT POST **************************************************/
  describe("DELETE /api/posts/:id/comments/:id", () => {
    // 1
    it.skip("should delete a comment", (done) => {
      chai
      .request(app)
      .delete("/api/posts/39/comments/31")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Commentaire supprimé !");
        done();
      });
    });
    // 2
    it("should generate an error because the post doesn't exist", (done) => {
      chai
      .request(app)
      .delete("/api/posts/38/comments/59")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, ce post n'existe pas !");
        done();
      });
    });
    // 3
    it("should generate an error because the comment doesn't exist", (done) => {
      chai
      .request(app)
      .delete("/api/posts/39/comments/2021")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, ce commentaire n'existe pas !");
        done();
      });
    });
    // 4
    it("should generate an error because the user doesn't have the rights to delete this comment (not his owner or admin)", (done) => {
      chai
      .request(app)
      .delete("/api/posts/39/comments/59")
      .set("authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de suppression pour ce commentaire !");
        done();
      });
    });
  });
});