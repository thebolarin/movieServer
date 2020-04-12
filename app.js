
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const movieRoutes = require('./route/movies')

const app = express();
app.use(cors());

const MONGODB_URI = 'mongodb+srv://bolarinwa:P8yOmHjo17w9UcO4@cluster0-25yze.mongodb.net/checkdc?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';



app.use(bodyParser.json()); // application/json


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use('/movie', movieRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const port = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(result => {
    const server = app.listen(port, () => console.log(`Yello!!!!!...Server started on port ${port}`));
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
      socket.on('disconnect', function () {
        console.log('Client disconnected');
      });
      socket.on('save-message', function (data) {
        console.log(data);
        io.emit('new-message', { message: data });
      });
    });
  })
  .catch(err => {
    console.log(err);
  });
