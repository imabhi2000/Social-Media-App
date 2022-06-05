const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://imabhi:loveanjali@cluster0.2uce9kq.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('connection with Remote sucessfull..');
}).catch((error)=>{
    console.log(error);
}); 