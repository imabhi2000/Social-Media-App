const path = require('path');
const express = require('express');
const app = express();
require('./db/db.js')
const port = process.env.PORT || 3000;
app.set('views' , path.join(__dirname , '/views'));
app.set('view engine' , 'ejs');
app.set('public' , path.join(__dirname , "/public"));
app.use(express.static('public'));


app.get('/' , (req,res)=>{
    res.render('index');
})

app.get('/about' , (req,res)=>{
    res.render('about.ejs');
})

app.listen(port , (error)=>{
    if(error) return console.log(error);

    console.log(`server is listening from the port ${port}`);
})