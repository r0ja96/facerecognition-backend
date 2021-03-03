import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: 'fcce34cb34e142319debfd1a1b241231'
   });
   
const imageApiCall =(req, res) =>{   
   app.models
   .predict(
   Clarifai.FACE_DETECT_MODEL,
   req.body.input
   ).then( data =>{
       res.json(data);
   })
   .catch(err => res.status(400).json('unable to work with API'));
   }


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

export {image, imageApiCall};