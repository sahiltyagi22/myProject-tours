const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
// const DB = process.env.DB_STRING

mongoose
  .connect('mongodb://127.0.0.1:27017/tours', {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected ');
  })
  .catch((err) => {
    console.log('there is an error' + err);
  });


  

app.listen(3000, () => {
  console.log('server is up and running');
});


