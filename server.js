import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import register from './controller/register.js';
import signIn from './controller/signIn.js';
import {image, imageApiCall} from './controller/image.js';
import profile from './controller/profile.js';

const app = express();

app.use(express.json());
app.use(cors());

const db = knex({
    client: 'mysql',
    connection:{
        host:'localhost',
        user: 'admin',
        password: 'admin',
        database: 'smartBrian'
    }
});

app.get('/profile/:id', profile(db));

app.put('/image',(req,res)=>{
    image(req,res,db);
});

app.post('/imageurl',(req,res) =>{ imageApiCall(req,res)});

app.post('/signin',signIn(db,bcrypt));

app.post('/register',(req,res)=>{
        register(req,res,db,bcrypt);
});

app.listen(3000,()=>{
    console.log('App is running on port 3000');
});