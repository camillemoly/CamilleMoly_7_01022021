var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");

chai.use(chaiHttp);

describe("connect.js", () => {

  /************************************************** SIGNUP **************************************************/
  describe("POST /api/auth/signup", () => {
    // 1
    it("should create a new user account", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        // change infos at each test or delete the user already created
        first_name: "Steve",
        last_name: "Rogers",
        email: "steve@test.com",
        password: "Steve2021!",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Compte utilisateur créé !");
        done();
      });
    });
    // 2
    it("should generate an error because the account is already existing", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: "Tony",
        last_name: "Stark",
        email: "tony@test.com",
        password: "Tony2021!",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Cet email est déjà associé à un compte.");
        done();
      });
    });
    // 3
    it("should generate an error because one field at least is empty or missing", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        last_name: "Rogers",
        email: "steve@test.com",
        password: "Steve2021!",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Tous les champs sont requis !");
        done();
      });
    });
    // 4
    it("should generate an error because first_name and/or last_name field(s) must not contain only spaces", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: " ",
        last_name: "Rogers",
        email: "steve@test.com",
        password: "Steve2021!",
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
    // 5
    it("should generate an error because first_name and/or last_name field(s) must not contain numbers", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: "Steve1",
        last_name: "Rogers",
        email: "steve@test.com",
        password: "Steve2021!",
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
    // 6
    it("should generate an error because first_name and/or last_name field(s) must not contain symbols", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: "Steve",
        last_name: "R@gers",
        email: "steve@test.com",
        password: "Steve2021!",
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
    // 7
    it("should generate a wrong email error", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: "Steve",
        last_name: "Rogers",
        email: "steve@test",
        password: "Steve2021!",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Email non valide !");
        done();
      });
    });
    // 8
    it("should generate a wrong password error", (done) => {
      chai
      .request(app)
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        first_name: "Steve",
        last_name: "Rogers",
        email: "steve@test.com",
        password: "Steve2021",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql(
            "Le mot de passe doit avoir une longueur comprise entre 8 et 16 caractères et contenir au moins une majuscule, une minuscule, un chiffre et un symbole."
          );
        done();
      });
    });
  });

  /************************************************** LOGIN **************************************************/
  describe("POST /api/auth/login", () => {
    // 1
    it("should connect the user", (done) => {
      chai
      .request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "admin@test.com",
        password: "Admin2021!",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("user_id");
        res.body.should.have.property("token");
        res.body.should.have.property("message").eql("Utilisateur connecté !");
        done();
      });
    });
    // 2
    it("should generate an error because the user account with this email doesn't exist or the email is invalid", (done) => {
      chai
      .request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "admiiin@test.com",
        password: "Admin2021!",
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql("Aucun compte ne correspond à l'email renseigné !");
        done();
      });
    });
    // 3
    it("should generate a wrong password error", (done) => {
      chai
      .request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "admin@test.com",
        password: "Admin2021",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Mot de passe incorrect !");
        done();
      });
    });
  });
});