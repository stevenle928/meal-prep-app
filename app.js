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
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

//mongodb client URI,database, and collection variables
const client = new mongodb.MongoClient(process.env.MONGO_URI);
const database = client.db('mealprepDB');
const Users = database.collection('users');
const Meals = database.collection('meals');

//run function connects to mongo Atlas DB
async function run() {
  try {
    await client.connect();
  } finally {
    console.log("connected");
  }
}
run().catch(console.dir);

/*Root directory loads home page and initially displays a submission form
  while hiding the element that displays the list of meals per day*/
app.route("/")
  .get(function(req, res) {
    const loadText = [{
      day: 0,
      meals: [],
    }];
    res.render("home", {
      listOfMeals: loadText,
      isHidden: "invisible" //passes "invisible" string to home.ejs to set bootstrap invisible class
    });

  })
  .post(async (req, res) => {
    const days = req.body.numberOfDays;
    const meals = req.body.numberOfMeals;
    const numberOfMeals = req.body.numberOfDays * req.body.numberOfMeals;
    //uses aggregate pipeline to return a CURSOR referencing RANDOM sample of X Int documents
    const findMeals = await Meals.aggregate([{
      $sample: {
        size: numberOfMeals
      }
    }]);

    const listOfMeals = await createList(days, meals, findMeals);
    res.render('home', {
      listOfMeals: listOfMeals,
      isHidden: "visible" //passes string to set "visible" bootstrap class in home.ejs
    });
  });

/*createList takes 3 parameters to create and return an array of objects
  Parameters:
    numDays: INT,
    mealsPerDay: INT,
    cursor: mongoDB cursor reference
  Object fields:
    day: Int,
    meals: object ---aka found documents from mongoDB Query*/
async function createList(numDays, mealsPerDay, cursor) {
  let dayGroup = new Array();
  for (let i = 0; i < numDays; i++) {
    let mealsForDay = new Object();
    mealsForDay.day = i + 1;
    mealsForDay.meals = [];
    for (let k = 0; k < mealsPerDay; k++) {
      if (await cursor.hasNext()) {
        const nextMeal = await cursor.next();
        mealsForDay.meals.push(nextMeal);
      }
    }
    dayGroup.push(mealsForDay);
  }
  return dayGroup;
}

app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {

  });

app.route("/register")
  .get(function(req, res) {
    res.render("register");
  })
  .post(function(req, res) {

  });



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(err) {
  console.log("listening on port: " + port);
});
