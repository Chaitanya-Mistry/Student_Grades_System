// Mongoose Library
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Chaitanya:hellomongodb@cluster0.onc9d.mongodb.net/Marksheet_Generator?authSource=admin&replicaSet=atlas-xj46er-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true');

mongoose.connection.on("connected", function(){
    console.log("Application is connected to the Database");
});
mongoose.connection.on("error", function(){
    console.log("Database Connection error");
});
