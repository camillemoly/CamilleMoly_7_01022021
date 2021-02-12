var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");

chai.use(chaiHttp);

/************************************************** GET ONE USER **************************************************/
describe("GET /api/users/:id", () => {
  // 1
  it("should find an user by his id", (done) => {
    chai
      .request(app)
      .get("/api/users/50")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
  // 2
  it("should generate an error because the user account with this id doesn't exist", (done) => {
    chai
      .request(app)
      .get("/api/users/1996")
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
  it("should modify an user by his id with all fields filled", (done) => {
    chai
      // add a id of user account existing before starting the test
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: "TestUn",
        last_name: "TestUn",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
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
  it("should modify an user by his id with some not mandatory fields empty", (done) => {
    chai
      // add a id of user account existing before starting the test
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: "TestDeux",
        last_name: "TestDeux",
        profile_picture: "",
        about: "Hello to everyone !",
      })
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
  it("should generate an error because the user account with this id doesn't exist", (done) => {
    chai
      .request(app)
      .put("/api/users/1996")
      .send({
        first_name: "TestTrois",
        last_name: "TestTrois",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
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
  it("should generate an error because a mandatory field at least is empty", (done) => {
    chai
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: "",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Les champs nom et prénom sont requis !");
        done();
      });
  });
  // 5
  it("should generate an error because first_name and last_name fields must not contain only whitespaces", (done) => {
    chai
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: " ",
        last_name: "TestCinq",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
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
  // 6
  it("should generate an error because first_name and last_name fields must not contain numbers", (done) => {
    chai
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: "Test6",
        last_name: "TestSix",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
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
  // 7
  it("should generate an error because first_name and last_name fields must not contain symbols", (done) => {
    chai
      .request(app)
      .put("/api/users/50")
      .send({
        first_name: "TestSept!",
        last_name: "TestSept",
        profile_picture: "http://www.placeholder.com/placeholder-image.jpg",
        about: "Hello world !",
      })
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
  it.skip("should delete an user by his id", (done) => {
    chai
      // add a id of user account existing before starting the test
      .request(app)
      .delete("/api/users/47")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Utilisateur supprimé !");
        done();
      });
  });
  // 2
  it("should generate an error because the user account with this id doesn't exist", (done) => {
    chai
      .request(app)
      .delete("/api/users/1996")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Suppression impossible, cet utilisateur n'existe pas !");
        done();
      });
  });
});
