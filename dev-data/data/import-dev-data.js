const fs = require('fs')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const TourModel = require('./../../models/tourModel')
console.log(TourModel);


dotenv.config({ path: './config.env' });


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


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json` , 'utf-8'))
// console.log(tours);


//    IMPORTING DEV DATA INTO DB
const importData =  async()=>{
    try {
        await TourModel.create(tours)
        console.log("data loaded successfully");
    } catch (error) {
        console.log(error);
    }
    process.exit()
    
}

//  DELETING EXISTING DATA FROM DB

const deleteData = async()=>{
    try {
        await TourModel.deleteMany()
        console.log('data deleted successfully');
        
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

if(process.argv[2]=== '--import'){
    importData()
}else if (process.argv[2] === '--delete'){
    deleteData()
}

// console.log(process.argv)