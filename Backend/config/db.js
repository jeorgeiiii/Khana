const { default: mongoose } = require('mongoose')


//function  for mongoose database connection

 const connect_db=async()=>{
    try {
      
        await mongoose.connect(process.env.Mongo_URL)
        console.log(`Connected To Database ${mongoose.connection.host}`)
        
    } catch (error) {
        console.log('DB Error',error)
    }
}

module.exports=connect_db;
