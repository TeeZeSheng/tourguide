const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../models/Tour');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// mongoose.connect(DB, {
  
// }).then(con => {
  
//   console.log("connected to database");
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//import data to database
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log("Data imported");
        process.exit();
    }catch(err) {
        console.log(err);
    }
};

//Delete all data from collection
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log("Data deleted");
        process.exit();
    }catch(err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import') {
    importData();
}else if (process.argv[2] === '--delete') {
    deleteData();
}