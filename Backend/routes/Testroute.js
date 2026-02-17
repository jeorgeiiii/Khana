const express=require('express');
const { testUSerController } = require('../controllers/testControllers');


//router object
const router =express.Router();


//routes GET | POST | UPDATE
router.get('/test-user',testUSerController)







//export
module.exports=router;