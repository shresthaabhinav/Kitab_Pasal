const express = require("express");
const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const paymentData = req.body;
    console.log("Received Payment Data:", paymentData);

    // You can do DB storage or verification here
    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;