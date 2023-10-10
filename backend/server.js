const express = require('express');
const cors = require('cors');
const PORT = 8080;
const { MongoClient, ObjectId } = require('mongodb');


const app = express();
app.use(express.json());
app.use(cors());
process.env.USER
process.env.PASS
process.env.HOST

const uri = `mongodb+srv://bruhmoment:bruhpassword@cluster0.j0vtett.mongodb.net `
const client = new MongoClient( uri )

let collection = null


// TODO
// Setup MongoDB client 
// Use PROCESS.ENV variables

app.post('/register', async (req, res) => {

    const dataAsJson = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        favorites: ""
    }
    

    
    
    let users = await client.db("UserInfo").collection("Users")
    const result = await users.findOne({'email': req.body.email})
    if(result != null){
      const result = await collection.insertOne(dataAsJson)
    }
    else{
      res.sendStatus(100)
    }
    
    console.log(dataAsJson);
    res.sendStatus(200);
});

app.post('/login', async (req, res) => {
  

    const dataAsJson = {
        email: req.body.email,
        password: req.body.password,
    }

    let users = await client.db("UserInfo").collection("Users")
    const result = await users.findOne(dataAsJson)
    if(result != null){
     res.sendStatus(200);
    }
    else{
      res.sendStatus(100)
    }
    
    console.log(dataAsJson);
    res.sendStatus(200);
})


app.listen(PORT, () => {
    console.log(`server is running on ${PORT} port`);
});