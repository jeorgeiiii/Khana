const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.get('/', ensureAuthenticated, (req, res) => {
    console.log('---- logged in user detail ---', req.user);
   res.status(200).json([{
        name:"Panner Tikka",
        price:200,
        category:"Indian",
        rating:4.5
    },{
        name:"Butter Chicken",
        price:300,
        category:"Indian",
        rating:4.7
    },{
        name:"Chowmein",
        price:150,
        category:"Chinese",
        rating:4.5
    },{
        name:"Fried Rice",
        price:180,
        category:"Chinese",
        rating:4.6  }]);
});

module.exports = router;