const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Book = require('../models/book'); // Assuming you have a Book model
const { authenticateToken } = require('./userAuth');

//Add book, Admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; 
        const user = await User.findById(id);
        if(user.role !== "admin") {
            return res.status(400).json({ message: "Access denied, only admin can add books" });
        }
        
        const book = new Book({
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language,
        });
        await book.save();
        res.status(200).json({ message: "Book added successfully"});

    }catch(error) {
        res.status(500).json({ message: "Internal Server Error" }); 
    }
});

//Update book, Admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate( bookid,{
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language,
        });

        return res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Delete book, Admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//Get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Get Recent books limit of 5
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(5);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Get book by ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

