const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const database = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
  	ssl: true
  }
});

database.select('*').from('users').then(data =>{
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {res.send(database.users)})
app.post('/signin', signin.handleSignin(database,bcrypt));
//create new user
app.post('/register', (req,res) => {register.handleRegister(req,res,database,bcrypt)});
app.get('/profile/:id',(req,res) => {profile.handleProfileGet(req,res,database)});
app.put('/image', (req,res) => {image.handleImage(req, res, database)});
app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)});
app.listen(process.env.PORT || 3005, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})