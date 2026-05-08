const express = require("express");
const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookingsByEmail);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
