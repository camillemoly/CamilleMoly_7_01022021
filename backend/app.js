// Imports
const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectRoutes = require('./routes/connect');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

// Create app
const app = express();

// DB connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});
sequelize.authenticate()
.then(() => console.log('Connection has been established successfully.'))
.catch (error => console.error('Unable to connect to the database:', error));

// Configure CORS options and add cors middleware
const corsOptions = {
	origin: '*',
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};
app.use(cors(corsOptions));

// Middleware to transform body requests received from frontend to JSON object
app.use(bodyParser.json());

// Routes
app.get('/api/posts', (req, res, next) => {
    const posts = [
      {
        _id: 'aaaaaaaaaaa',
        user_id: 'bbbbbbbbbbbb',
        text: 'Yo les gens !!'
      },
      {
        _id: 'oeihfzeoi',
        user_id: 'qsomihvqios',
        text: 'Hello tout le monde !! Comment ça va ce matin ? Prêts pour aller travailler ?',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg'
      },
      {
        _id: 'ghytjyhrgr',
        user_id: 'fdgdhyjyyjyj',
        text: 'Vivement que la journée se termine...!'
      },
    ];
    res.status(200).json(posts);
});

app.post('/api/posts', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
});

app.use('/api/auth', connectRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);

module.exports = app;
module.exports = sequelize;