require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');


app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));


// Replace the uri string with your MongoDB deployment's connection string.

const client = new mongodb.MongoClient(process.env.MONGO_URI);
const database = client.db('mealprepDB');
const users = database.collection('users');
const meals = database.collection('meals');

// async function run() {
//   try {
//     await client.connect();
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { };
//     const user = await users.findOne(query);
//
//     console.log(user);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res){

  });

app.route("/register")
  .get(function(req, res){
    res.render("register");
  })
  .post(function(req, res){

  });


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(err){
  console.log("listening on port: " + port);
});
