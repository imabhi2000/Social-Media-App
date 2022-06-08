const mongoose = require('mongoose');
const keys = require('../config/keys.js');
mongoose.connect(keys.mongourl).then(()=>{
    console.log('connection with Remote Database sucessfull..');
}).catch((error)=>{
    console.log(error);
}); 