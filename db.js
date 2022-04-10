const mongoose = require('mongoose')

const express = require('express');
// require express
const app = express();

// connect to db
module.exports = {
    connectDb : mongoose.connect('mongodb://localhost:27017/blog')
    .then((result) => console.log('Connected'))
    .catch((err) => console.log(err))
}
