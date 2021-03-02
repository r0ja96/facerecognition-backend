
const register = (req,res, db, bcrypt)=>{
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

}

export default register;