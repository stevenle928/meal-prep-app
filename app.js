require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');


app = express();



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
