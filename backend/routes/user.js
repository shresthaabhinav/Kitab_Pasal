const router = require('express').Router();
const User = require('../models/user'); // Assuming you have a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./userAuth'); // Import the authentication middleware

//Sign Up

router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check username length is more than 4 Characters
        if (username.length <= 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters long" });
        }

        //check username is not already taken
        const existingUsername = await User.findOne({username: username});
        if(existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        //check email is not already taken
        const existingEmail = await User.findOne({email: email});
        if(existingEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        //check password length is more than 5 Characters
        if (password.length < 5) {
            return res.status(400).json({ message: "Password must be at least 5 characters long" });
        }

        //hashing the password
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username:username, 
            email:email,
            password:hashPass, 
            address:address
        });

        await newUser.save();
        return res.status(200).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }       
});


//Sign In

router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if(!existingUser) {
            res.status(400).json({ message: "Username not found" });
            return;
        }
        await bcrypt.compare(password, existingUser.password,(err,data) =>{
            if(data){
                const authClaims = [
                    {name : existingUser.username},
                    {role : existingUser.role}
                ]

                const token = jwt.sign({authClaims},"bookStore123",{
                    expiresIn: "30d",
                });
                res.status(200).json({ id: existingUser._id , role: existingUser.role, token: token, message: "Login Successful" });
            }
            else{
                res.status(400).json({ message: "Invalid Password" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }       
});

//Get User Profile

router.get('/get-user-information', authenticateToken, async (req, res) => {
    try{
        const { id } = req.headers;
        const data = await User.findById(id).select('-password'); // Exclude password from the response
        return res.status(200).json(data);

    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }

});

//update address

router.put('/update-address', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const {address} =req.body;

        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;