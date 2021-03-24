var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); //choose env file depending on the environment
let adminToken;
let userToken;

chai.use(chaiHttp);

describe("users.js", () => {

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

  /************************************************** GET ONE USER **************************************************/
  describe("GET /api/users/:id", () => {
    // 1
    it("should find an user", (done) => {
      chai
      .request(app)
      .get("/api/users/56")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("first_name");
        res.body.should.have.property("last_name");
        res.body.should.have.property("profile_picture");
        res.body.should.have.property("about");
        res.body.should.have.property("is_admin");
        done();
      });
    });
    // 2
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .get("/api/users/2021")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Aucun utilisateur ne correspond à cet identifiant !");
        done();
      });
    });
  });

  /************************************************** MODIFY USER **************************************************/
  describe("PUT /api/users/:id", () => {
    // 1
    it("should modify an user with user infos and image", (done) => {
      chai
      // add a id of user account existing before starting the test
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .attach("image", "./test/placeholder.png", "placeholder.png")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Profil modifié avec succès !");
        done();
      });
    });
    // 2
    it("should modify an user with user infos only", (done) => {
      chai
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Profil modifié avec succès !");
        done();
      });
    });
    // 3
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .put("/api/users/55")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Modification impossible, cet utilisateur n'existe pas !");
        done();
      });
    });
    // 4
    it("should generate an error because the user doesn't have the rights to modify this user account (not his owner or admin)", (done) => {
      chai
      .request(app)
      .put("/api/users/56")
      .set("authorization", `Bearer ${userToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de modification pour ce profil !");
        done();
      });
    });
    // 5
    it("should generate an error because a mandatory field at least is empty and/or missing", (done) => {
      chai
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Les champs nom et prénom sont requis !");
        done();
      });
    });
    // 6
    it("should generate an error because first_name and/or last_name field(s) must not contain only spaces", (done) => {
      chai
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "    ",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql(
            "Les champs prénom et nom ne doivent pas contenir uniquement des espaces !"
          );
        done();
      });
    });
    // 7
    it("should generate an error because first_name and/or last_name field(s) must not contain numbers", (done) => {
      chai
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron1",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql(
            "Les champs prénom et nom ne doivent pas contenir de chiffres !"
          );
        done();
      });
    });
    // 8
    it("should generate an error because first_name and/or last_name field(s) must not contain symbols", (done) => {
      chai
      .request(app)
      .put("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .field(
        "user", JSON.stringify({
          first_name: "Iron@",
          last_name: "Man",
          about: "Hello world !"
        })
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql(
            "Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !"
          );
        done();
      });
    });
  });

  /************************************************** DELETE USER **************************************************/
  describe("DELETE /api/users/:id", () => {
    // 1
    it.skip("should delete an user", (done) => {
      chai
      // add a id of user account existing before starting the test
      .request(app)
      .delete("/api/users/57")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Utilisateur supprimé !");
        done();
      });
    });
    // 2
    it("should generate an error because the user account doesn't exist", (done) => {
      chai
      .request(app)
      .delete("/api/users/2021")
      .set("authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, cet utilisateur n'existe pas !");
        done();
      });
    });
    // 3
    it("should generate an error because the user doesn't have the rights to delete this user account (not his owner or admin)", (done) => {
      chai
      .request(app)
      .delete("/api/users/56")
      .set("authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("L'utilisateur ne dispose pas des droits de suppression pour ce profil !");
        done();
      });
    });
  });
});