// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../db-connection/db-connection');
var initModels = require('../models/init-models');
var models = initModels(sequelize);

// Validators
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().symbols(1)
.has().not().spaces();
const numberValidator = new RegExp(/\d/);
const symbolsValidator = new RegExp(/^[^@&"()!_$*€£`+=\/;?#]+$/);

// Signup
exports.signup = (req,res,next) => {
    if (numberValidator.test(req.body.first_name) === true || numberValidator.test(req.body.last_name) === true) {
        return res.status(401).json({ error: 'Les champs prénom et nom ne doivent pas contenir de chiffres !' });
    } else if (symbolsValidator.test(req.body.first_name) === false || symbolsValidator.test(req.body.last_name) === false) {
        return res.status(401).json({ error: 'Les champs prénom et nom ne doivent pas contenir de caractères spéciaux !' });
    } if  (emailValidator.validate(req.body.email) === false) {
        return res.status(401).json({ error: 'Email non valide !' });
    } else if (passwordSchema.validate(req.body.password) === false) {
        return res.status(401).json({ error: 'Mot de passe incorrect ! Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un symbole' });
    } else if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
        return res.status(401).json({ error: 'Tous les champs sont requis !' });
    }
    models.users.findOne({ where: { email: req.body.email }})
    .then(user => {
        if (user) {
            return res.status(401).json({ error: 'Cet email est déjà associé à un compte.' });
        } else if (user === null) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = models.users.create({
                    email: String(req.body.email),
                    password: String(hash),
                    first_name: String(req.body.first_name),
                    last_name: String(req.body.last_name)
                });
                res.status(201).json({ message: 'Compte créé !' });
            })
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// Login
exports.login = (req,res,next) => {
    models.users.findOne({ where: { email:req.body.email } })
    .then(user => {
        if (user === null) {
            res.status(401).json({ error: 'L\'email renseigné n\'est associé à aucun compte!' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                user_id: user.id,
                token: jwt.sign(
                    { user_id: user.id },
                    process.env.SECRET_KEY,
                    { expiresIn: '24h' }
                ),
                message: 'Utilisateur connecté !'
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};