
const signIn = (db,bcrypt)=> (req,res) => {

    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission');
    }
    
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
}

export default signIn;