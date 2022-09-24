const express = require("express");

const {users} = require('../data/users.json');

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users  
 * Access: Public
 * parameters: None
 */
 router.get('/users/:id',(req,res) =>{
    const {id} = req.params
    const user = users.find((each) => each.id === id  );
    if (!user) {
        return res.status(404).json({
        success:false,
        message:"User not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: user,
        
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by id 
 * Access: Public
 * parameters: None
 */

router.get('/users', (req,res) =>{
    res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * Route: /users
 * Method: POST
 * Description: Create new user 
 * Access: Public
 * parameters: None
 */
router.post('/users',(req,res) => {
    const {id,name,surname,email,subscriptionType,subscriptionDate} = 
    req.body;

    const user = users.find((each) => each.id === id);

    if(user){
        return res.status(404).json({
            success: false,
            message: "User exists with this id",

        });

    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionDate,
        subscriptionType,
    });
    return res.status(201).json({
        success: true,
        data: users,

    });

});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating  user data 
 * Access: Public
 * parameters: id
 */
router.put('/users/:id', (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({success: false, message: "User not found"});

const updatedUser = users.map((each) => {
    if(each.id === id){
        return {
            ...each,
            ...data,
        };

    }

    return each;
});

return res.status(200).json({
    success: true,
    data: updatedUser,
});


});


/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete a user by id
 * Access: Public
 * parameters: id
 */

router.delete('/users/:id', (req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);

    if(!user){
        return res.status(202).json({
            success: false,
            message: "User to be deleted was not found",

        });

    }

    const index = users.indexOf(user);
    users.splice(index,1);

    return res.status(200).json({ success: true, data: users});

});
/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * parameters: id
 */

router.get('/subscription-details/:id', (req,res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({
        success: false,
        message: "User not found",
    });
 
    const getDateInDays = (data = "") => {
        let date;
        if(data === ""){

            // current date
            date = new Date();
        } else {

            // getting date on basis of data variable
            date = new Date(data);
        }
        let days = Math.floor(date / (1000*60*60*24));
        return days;
    };

    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date = date + 90;

        } else if (user.subscriptionType === "standard"){
            date = date + 180;

        } else if (user.subscriptionType === "premium"){
            date = date + 365;
        }

        return date;

    };

   // subscription expiration calculation
   // january 1, 1970, UTC. //milliseconds
   let returnDate = getDateInDays(user.returnDate);
   let currentDate = getDateInDays();
   let subscriptionDate = getDateInDays(user.subscriptionDate);
   let subscriptionExpiration = subscriptionType(subscriptionDate);



   const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration: 
     subscriptionExpiration <= currentDate 
     ? 0 
     : subscriptionExpiration - currentDate,
    
     
    fine:
      returnDate < currentDate ?
      subscriptionExpiration <= currentDate
      ? 200 
      : 100
     : 0,


   };

   res.status(200).json({
    success: true,
    data,

   });
    
});

module.exports = router;