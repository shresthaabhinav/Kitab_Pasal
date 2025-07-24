const router = require('express').Router();
const User = require('../models/user'); // Assuming you have a User model
const { authenticateToken } = require('./userAuth');

//Put book to cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
    try {
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookinCart = userData.cart.includes(bookid);
        if(isBookinCart){
            return res.status(200).json({message: "Book already in cart"});
        }
        await User.findByIdAndUpdate(id,{
            $push: { cart: bookid }
        });
        return res.status(200).json({message: "Book added to cart"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
        });
        
//Delete book from cart
router.put("/delete-book-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const {bookid} = req.params;
        const {id} = req.headers;
        const userData = await User.findById(id);
        const isBookinCart = userData.cart.includes(bookid);
        if(!isBookinCart){
            return res.status(200).json({message: "Book not in cart"});
        }
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid }
        });
        return res.status(200).json({message: "Book removed from cart"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

//Get Cart books of a user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate('cart');
        const cart = userData.cart.reverse();

        return res.json({
            status: "success",
            data: cart,
        });
    } catch (error) {   
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;
