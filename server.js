import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

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

const database = {
    users:[{
        id: '123',
        name: 'Alan',
        email:'rodriguezalan27@gmail.com',
        password: '391a',
        entries: 0,
        joined: new Date()
    },{
        id: '1234',
        name: 'Daniel',
        email:'daniel@gmail.com',
        password: '391d',
        entries: 0,
        joined: new Date()
    },{
        id: '12345',
        name: 'Karen',
        email:'karen@gmail.com',
        password: '391k',
        entries: 0,
        joined: new Date()
    }
]
}

app.get('/',(req,res) =>{
    res.json(database.users);
});

app.get('/profile/:id',(req,res) =>{
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id
    }).then(response =>
        response.length!== 0?res.json(response[0]):res.status(404).json('no such user')
    ).catch(console.log);
});

app.put('/image',(req,res)=>{
    const { id } = req.body;
    let found = false;
   db('users').where('id', '=',id).increment('entries',1).then(entries =>{
       if(entries){
        db('users').select('entries').where('id','=',id).then(response =>{
            res.json(response[0]);
        }).catch(err =>{
            response.status(400).json(err);
        });
       }else{
        res.status(404).json('cannot increment');
       }
   }).catch(err => {
       console.log('err',err);
   });
});

app.post('/signin',(req,res)=>{

    const {email,password} = req.body;
    
    db.select('email','hash').from('login').where('email','=',email).then(data =>{
        if(data.length === 1){
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid){
                db.select('*').from('users').where('email','=',email).then(user =>{
                    res.json(user[0]);
                }).catch(err => {
                    res.status(404).json('unable to get user');
                });
            }else{
                res.status(400).json('Wrong password');
            }

        }else{
            res.status(404).json('Email does not existe');
        }
    }).catch( err =>{
        res.status(400).json('wrong credentials');
    });
});

app.post('/register',(req,res)=>{
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx =>{
        trx.insert({
            hash,email
        }).into('login').then(response => {

            return trx('users').insert({
                email: email,
                name: name,
                joined: new Date()
            }).then(response => {
              return trx('users').where('email',email).then(response =>{ res.json(response[0])}).catch(err =>{ res.json(err)});
              
            }).catch(err =>{
                res.json('unable to register');
            });
            
        }).then(trx.commit).catch(trx.rollback);
    }).catch(err =>{
        res.json('unable to register');
    });

});

app.listen(3000,()=>{
    console.log('App is running on port 3000');
});