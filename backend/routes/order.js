const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book"); // Assuming you have a Book model
const Order = require("../models/order"); // Assuming you have an Order model
const User = require("../models/user"); // Assuming you have a User model

// Place an order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order, paymentMethod } = req.body; // ✅ FIXED

    for (const orderData of order) {
      const newOrder = new Order({
        user: id,
        book: orderData._id,
        paymentMethod: paymentMethod, // ✅ using this now
      });

      const orderDataFromDb = await newOrder.save();

      // Save to user's orders
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // Remove from user's cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.json({
      status: "success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get Order History of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    // console.log(id)
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const orderData = userData.orders.reverse();
    return res.json({
      status: "success",
      data: orderData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Get All Orders , Admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Update Order, Admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "success",
      message: "status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

module.exports = router;
