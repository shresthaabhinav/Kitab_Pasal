const router = require('express').Router();
const User = require('../models/user'); // Assuming you have a User model
const {authenticateToken} = require('./userAuth'); // Import the authentication middleware

//Add book to favourites
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);

        if(isBookFavourite){
            return res.status(200).json({message: "Book already in favourites"});
        }
        await User.findByIdAndUpdate(id, {
            $push: { favourites: bookid }
        });
        return res.status(200).json({message: "Book added to favourites"});
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

//Delete book from favourites
router.put("/delete-book-from-favourites", authenticateToken, async (req, res) => {
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);

        if(!isBookFavourite){
            return res.status(200).json({message: "Book not in favourites"});
        }
        await User.findByIdAndUpdate(id, {
            $pull: { favourites: bookid }
        });
        return res.status(200).json({message: "Book removed from favourites"});
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

//Get Favourite books of a user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate('favourites');
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "success",
            data: favouriteBooks,
        });
    }
    catch(error){   
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;

