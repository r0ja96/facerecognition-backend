import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

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
    database.users.forEach(user =>{

        if(user.id === id){
            found = true;
           return res.json(user);
            
        }
    });
    if(!found)res.status(404).json('no such user');
});

app.put('/image',(req,res)=>{
    const { id } = req.body;
    let found = false;
    database.users.forEach(user =>{

        if(user.id === id){
            found = true;
            user.entries++;
           return res.json(user.entries);
            
        }
    });
    if(!found)res.status(404).json('no such user');
});

app.post('/signin',(req,res)=>{

    bcrypt.compare('129','$2a$10$fqgKcMcGL2OeMVHen9GZJuaCcL7VS7dqC/h/4Xzgm5ealbA43P53m',(err,res) =>{
        console.log(res);
    });
    bcrypt.compare('125','$2a$10$fqgKcMcGL2OeMVHen9GZJuaCcL7VS7dqC/h/4Xzgm5ealbA43P53m',(err,res) =>{
        console.log(res);
    });
    console.log(req.body);
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.status(200).json(database.users[0]);
    }else{

    res.status(400).json('error signin');
    }
});

app.post('/register',(req,res)=>{
    const {email, name, password} = req.body;

    bcrypt.hash(password,null,null, (err, hash)=>{
        console.log(hash);
    });

    database.users.push({
        id: '123456',
        name,
        email,
        password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
});

app.listen(3000,()=>{
    console.log('App is running on port 3000');
});