var chai = require("chai");
var chaiHttp = require("chai-http");
var should = require("chai").should();
var app = require("../app");

chai.use(chaiHttp);

/************************************************** SIGNUP **************************************************/
describe("POST /api/auth/signup", () => {
  // 1
  it.skip("should create an user account", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        // change infos at each test or delete the user already created
        first_name: "Tony",
        last_name: "Stark",
        email: "tony@test.com",
        password: "iAmIr0nM@n",
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
  it.skip("should generate an error because the account is already existing", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Tony",
        last_name: "Stark",
        email: "tony@test.com",
        password: "iAmIr0nM@",
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
  it("should generate an empty field error", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        last_name: "Banner",
        email: "bruce@test.com",
        password: "iAmHu1k!",
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
  it("should generate an email error", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Steven",
        last_name: "Rogers",
        email: "steven@test",
        password: "iAmC@ptainAmer1ca",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Email non valide !");
        done();
      });
  });
  // 5
  it("should generate a password error", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Thor",
        last_name: "Odinson",
        email: "thor@test.com",
        password: "iamthor",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("error")
          .eql(
            "Mot de passe incorrect ! Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un symbole."
          );
        done();
      });
  });
  // 6
  it("should generate an error because first_name and last_name fields must not contain only whitespaces", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: " ",
        last_name: "Parker",
        email: "peter@test.com",
        password: "iAmSp1derMan!",
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
  // 7
  it("should generate an error because first_name and last_name fields must not contain numbers", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Peter1",
        last_name: "Parker",
        email: "peter@test.com",
        password: "iAmSp1derMan!",
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
  // 8
  it("should generate an error because first_name and last_name fields must not contain symbols", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        first_name: "Natasha",
        last_name: "Rom@noff",
        email: "natasha@test.com",
        password: "iAmBl@ackW1dow",
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

/************************************************** LOGIN **************************************************/
describe("POST /api/auth/login", () => {
  // 1
  it("should login the user", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "camillemoly@test.com",
        password: "Camille1996!",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Utilisateur connecté !");
        done();
      });
  });
  // 2
  it("should generate an error because the account doesn't exist", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "toto@test.com",
        password: "Hello123!",
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
      .send({
        email: "camillemoly@test.com",
        password: "Camille1995!",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("error").eql("Mot de passe incorrect !");
        done();
      });
  });
});
