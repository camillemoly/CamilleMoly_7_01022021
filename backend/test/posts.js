var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); //choose env file depending on the environment

chai.use(chaiHttp);

/************************************************** GET ALL POSTS **************************************************/
describe("GET /api/posts/", () => {
  // 1
  it("should find all posts", (done) => {
    chai
      .request(app)
      .get("/api/posts")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  // 2
  it.skip("should generate an error if no post exist", (done) => {
    chai
      .request(app)
      .get("/api/posts")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Aucun post trouvé !");
        done();
      });
  });
});

/************************************************** GET ONE POST **************************************************/
describe("GET /api/posts/:id", () => {
  // 1
  it("should find one post by his id", (done) => {
    chai
      .request(app)
      .get("/api/posts/32")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
  // 2
  it.skip("should generate an error if the post with this id doesn't exist", (done) => {
    chai
      .request(app)
      .get("/api/posts/1996")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Le post recherché n'existe pas !");
        done();
      });
  });
});

/************************************************** CREATE POST **************************************************/
describe("POST /api/posts", () => {
  // 1
  it("should create a post", (done) => {
    chai
      .request(app)
      .post("/api/posts")
      .send({
        user_id: 54,
        content: "Hello world !",
        post_picture: ""
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post créé !");
        done();
      });
  });
  // 2
  it("should generate an error because the user account doesn't exist", (done) => {
    chai
      .request(app)
      .post("/api/posts")
      .send({
        user_id: 1996,
        content: "Hello world !",
        post_picture: ""
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
      .post("/api/posts")
      .send({
        user_id: 1996,
        content: "Hello world !",
        post_picture: ""
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should generate an error because the post must have a content", (done) => {
    chai
      .request(app)
      .post("/api/posts")
      .send({
        user_id: 54,
        content: "",
        post_picture: "http://www.placeholder.com/image-placeholder.jpg"
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should modify a post by his id", (done) => {
    chai
      .request(app)
      .put("/api/posts/32")
      .send({
        content: "Hello everybody !",
        post_picture: ""
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post modifié !");
        done();
      });
  });
  // 2
  it("should generate an error because the post with this id doesn't exist", (done) => {
    chai
      .request(app)
      .put("/api/posts/1996")
      .send({
        content: "Hello everybody !",
        post_picture: ""
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should generate an error because the post must have a content", (done) => {
    chai
      .request(app)
      .put("/api/posts/32")
      .send({
        content: "",
        post_picture: "http://www.placeholder.com/image-placeholder.jpg"
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it.skip("should delete a post by his id", (done) => {
    chai
      .request(app)
      .delete("/api/posts/32")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Post supprimé !");
        done();
      });
  });
  // 2
  it("should generate an error because the post with this id doesn't exist", (done) => {
    chai
      .request(app)
      .delete("/api/posts/1996")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, ce post n'existe pas !");
        done();
      });
  });
});

/************************************************** LIKE POST **************************************************/
describe("POST /api/posts/:id/likes", () => {
  // 1
  it("should like a post", (done) => {
    chai
      .request(app)
      .post("/api/posts/32/likes")
      .send({
        user_id: 54,
        post_id: 32
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
      .post("/api/posts/32/likes")
      .send({
        user_id: 1996,
        post_id: 32
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
      .post("/api/posts/32/likes")
      .send({
        user_id: 1996,
        post_id: 32
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should generate an error because the post id doesn't exist", (done) => {
    chai
      .request(app)
      .post("/api/posts/1996/likes")
      .send({
        user_id: 54,
        post_id: 1996,
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
describe("DELETE /api/posts/:id/likes/:id", () => {
  // 1
  it.skip("should unlike a post", (done) => {
    chai
      .request(app)
      .delete("/api/posts/32/likes/32")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Like annulé !");
        done();
      });
  });
  // 2
  it("should generate an error because the like with this id doesn't exist", (done) => {
    chai
      .request(app)
      .delete("/api/posts/32/likes/1996")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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

/************************************************** COMMENT POST **************************************************/
describe("POST /api/posts/:id/comments", () => {
  // 1
  it("should comment a post", (done) => {
    chai
      .request(app)
      .post("/api/posts/32/comments")
      .send({
        user_id: 54,
        post_id: 32,
        content: "Ahahah",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
      .post("/api/posts/32/comments")
      .send({
        user_id: 1996,
        post_id: 32,
        content: "Ahahah",
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
      .post("/api/posts/32/comments")
      .send({
        user_id: 1996,
        post_id: 32,
        content: "Ahahah",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should generate an error because the post id doesn't exist", (done) => {
    chai
      .request(app)
      .post("/api/posts/1996/comments")
      .send({
        user_id: 54,
        post_id: 1996,
        content: "Ahahah",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it("should generate an error because a comment must not be empty", (done) => {
    chai
      .request(app)
      .post("/api/posts/32/comments")
      .send({
        user_id: 54,
        post_id: 32,
        content: "",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
describe("PUT /api/posts/:id/comments/:id", () => {
  // 1
  it("should modify a comment by his id", (done) => {
    chai
      .request(app)
      .put("/api/posts/32/comments/26")
      .send({
        content: "Hello everybody !",
        post_picture: "",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Commentaire modifié !");
        done();
      });
  });
  // 2
  it("should generate an error because the comment with this id doesn't exist", (done) => {
    chai
      .request(app)
      .put("/api/posts/32/comments/1996")
      .send({
        content: "Hello everybody !",
        post_picture: "",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Modification impossible, ce commentaire n'existe pas !");
        done();
      });
  });
  // 3
  it("should generate an error because the comment must have a content", (done) => {
    chai
      .request(app)
      .put("/api/posts/32/comments/26")
      .send({
        content: "",
        post_picture: "http://www.placeholder.com/image-placeholder.jpg",
      })
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
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
  it.skip("should delete a comment by his id", (done) => {
    chai
      .request(app)
      .delete("/api/posts/32/comments/32")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Commentaire supprimé !");
        done();
      });
  });
  // 2
  it("should generate an error because the comment with this id doesn't exist", (done) => {
    chai
      .request(app)
      .delete("/api/posts/32/comments/1996")
      .set("authorization", `Bearer ${process.env.USER_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, ce commentaire n'existe pas !");
        done();
      });
  });
});
