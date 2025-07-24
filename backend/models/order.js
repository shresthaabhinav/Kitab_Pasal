const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "esewa"],
      required: true,
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out for delivery", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", order);
