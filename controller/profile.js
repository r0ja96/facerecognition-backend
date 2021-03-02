const profile = (db) => (req,res) => {
    const { id } = req.params;
    
    db.select('*').from('users').where({id
    }).then(response =>
        response.length!== 0?res.json(response[0]):res.status(404).json('no such user')
    ).catch(console.log);
}

export default profile;