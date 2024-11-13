// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const port = 3005;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);

mongoose
  .connect(
    'mongodb+srv://progeat:silviaS2000@clustertest.vfynt.mongodb.net/blog?retryWrites=true&w=majority&appName=ClusterTest'
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  });
