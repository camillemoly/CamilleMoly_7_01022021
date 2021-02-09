const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().not().spaces();

const sequelize = require('../db-connection/db-connection');
var initModels = require('../models/init-models');
var models = initModels(sequelize);

// Signup
exports.signup = (req,res,next) => {
    if (emailValidator.validate(req.body.email) === false) {
        return res.status(401).json({ error: 'Email non valide !' });
    } else if (passwordSchema.validate(req.body.password) === false) {
        return res.status(401).json({ error: 'Mot de passe incorrect ! Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule et un chiffre' });
    }
    models.users.findOne({ where: { email: req.body.email }})
    .then(user => {
        if (user) {
            return res.status(401).json({ error: 'Cet email est déjà associé à un compte.' });
        } else if (user === null) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = models.users.create({
                    email: req.body.email,
                    password: hash,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                });
                res.status(201).json({ message: `Compte de ${req.body.first_name} créé !` });
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
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};