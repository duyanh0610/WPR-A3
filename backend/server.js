const express =require('express');
const mongodb= require('mongodb')
const cor = require ('cors')

const a= express();
let db = null;


// client 
a.use(express.static('public'));
//decode req.body (form-data)
a.use(express.urlencoded({extended:true}));
//decode req.body (post body message)
a.use(express.json());
//unblock 
a.use(cor());

//connect db
async function startServer(){
    const dtbase='wpr-quiz';
    const url= `mongodb://localhost:27017/${dtbase}`; 
    const client = await mongodb.MongoClient.connect(url);
    db= client.db();
    console.log('Connected to db');
    // console.log(db.collection('questions').find().toArray())

    //listening 
    a.listen(3001, function(){
        console.log('Listening on port 3001!');
    });
}
startServer();



// get all questions
a.get('/questions', async function(req,res){ 
    const result = await db.collection('questions').find().toArray();

    res.status(200).json(result);
})

//add new 
a.post('/questions', async function(req,res){ 
 
    const  text = req.body.text;
    const answers = req.body.answers;
    const correctAnswer = req.body.correctAnswer;
    const _id = mongodb.ObjectId();



    let check1 = text.replace(/\s+/g,'');

    let check2 = true;
    for (let i = 0; i<answers.length; i++) { 
        let value = answers[i].replace(/\s+/g,'');
        console.log(value)
        if(value == ""){ 
            check2= false;
        }
        
    }
    
    
    // check exist
    // const question = await db.collection('questions').findOne({text:text})
    // if (question != null) { //exist
    //      res.status(409).end("exist"); //conflict
    // }   
    if  ( check1 == "" || check2 == false || text == null || answers == null || answers.length == 0 ||   correctAnswer <= -1 || correctAnswer == undefined   ){
        res.status(400).end ("Invalid data")
    }
    else {
        const result = await db.collection('questions').insertOne({_id:_id,answers: answers,text:text, correctAnswer: correctAnswer });
    
    const question = {
        _id: _id, 
        answers: answers, 
        text: text,
        correctAnswer: correctAnswer
    }
    
    res.status(201).json(question);
    }
})




// get detail 
a.get ('/questions/:id', async function (req,res){
    const _id = req.params.id;
    
    console.log(_id);

    const question = await db.collection('questions').findOne({_id:mongodb.ObjectId(_id)});
    if ( question == null ) { 
        res.status(404).end("Not found"); // not found 
    } else { 
        res.status(200).json(question);
    }
})


//update 
a.put('/questions/:id', async function(req,res){
    const id = req.params.id;

    const text = req.body.text;
    const answers = req.body.answers;
    const correctAnswer = req.body.correctAnswer;
    
    const filter = {_id: mongodb.ObjectId(id)};
    const update= {
        $set: {
            answers: answers,
            text: text, 
            correctAnswer: correctAnswer
        }
    }
    
    let check1 = text.replace(/\s+/g,'')

    let check2 = true;
    for (let i = 0; i<answers.length; i++) { 
        let value = answers[i].replace(/\s+/g,'');
        
        if(value == ""){ 
            check2= false;
        }  
    }
    
    // check exist
    const exist = await db.collection('questions').findOne({_id:mongodb.ObjectId(id)});
    if (exist  == null) { 
        res.status(404).end("Not found");
    }
    if (check1 == "" || check2 ==false  || text == null || answers == null || answers.length == 0||   correctAnswer <= -1 || correctAnswer== undefined ) { //ivalid data
        res.status(400).end("Invalid data") 
    
    } 
    else {
        const result = await db.collection('questions').updateOne(filter, update);
        return res.status(200).json(result);
    }
})

//delete
a.delete("/questions/:id", async function (req,res) { 
    
    const _id = req.params.id;
    //check exist
    const question= await db.collection('questions').findOne({_id:mongodb.ObjectId (_id) });
    if ( question == null) {    // not exist
        return res.status(404).end("Not found");
    }

    const result = await db.collection('questions').deleteOne({_id:mongodb.ObjectId(_id)});
    
     res.status(200).end();

})











