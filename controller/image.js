const image = (req,res, db)=>{
    const { id } = req.body;

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
}

export default image;