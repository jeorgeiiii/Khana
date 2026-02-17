const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connect_db = require('./config/db');


//Configuration

dotenv.config();


//DB connection
connect_db();

//object
const app=express();


//Mid-Man
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
//URl=http://localhost:80800
app.use('/api/v1/test', require('./routes/Testroute'));
app.use('/api/v1/auth',require('./routes/authRoutes'));
app.use('/api/v1/user',require('./routes/userroute'));
app.use('/api/v1/resturant',require('./routes/resturantRoutes'));
app.use('/api/v1/category',require('./routes/categoryRoutes'));
app.use('/api/v1/food',require('./routes/foodRoutes'));

app.get('/',(req ,res)=>{
    return res.status(200).send("<h2>Weclome to Food Resturant </h2>");
});
 //Port 
 const PORT=process.env.PORT || 5000;
 
 //Listen
 app.listen(PORT,()=>{
    console.log(`Server Running ${PORT}`);
 });