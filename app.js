
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet= require('helmet');
const compression = require('compression');
const movieRoutes = require('./route/movies')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname,'access.log'),
  {flags:'a'}
);

const app = express();
app.use (helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined' , {stream:accessLogStream}));




const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-25yze.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;

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
