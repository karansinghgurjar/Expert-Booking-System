const mongoose = require("mongoose");
const Expert = require("../models/Expert");
const Booking = require("../models/Booking");

const emailRegex = /^\S+@\S+\.\S+$/;
const bookingStatuses = ["Pending", "Confirmed", "Completed"];
const slotAlreadyBookedMessage = "This slot is already booked. Please choose another slot.";

const sendValidationError = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

const validateBookingInput = ({ expertId, name, email, phone, date, time, notes }) => {
  if (!expertId) return "Expert ID is required";
  if (!mongoose.Types.ObjectId.isValid(expertId)) return "Invalid expert ID";
  if (!name || name.trim().length < 2) return "Name must be at least 2 characters";
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  if (!phone) return "Phone is required";
  if (!date) return "Date is required";
  if (!time) return "Time is required";
  if (notes && notes.length > 500) return "Notes cannot exceed 500 characters";

  return null;
};

const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, time, notes = "" } = req.body;
    const validationError = validateBookingInput({
      expertId,
      name,
      email,
      phone,
      date,
      time,
      notes,
    });

    if (validationError) {
      return sendValidationError(res, validationError);
    }

    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found",
      });
    }

    const selectedSlot = expert.availableSlots.find(
      (slot) => slot.date === date && slot.time === time
    );

    if (!selectedSlot) {
      return sendValidationError(res, "Selected slot does not exist.");
    }

    if (selectedSlot.isBooked) {
      return res.status(409).json({
        success: false,
        message: slotAlreadyBookedMessage,
      });
    }

    let booking;

    try {
      booking = await Booking.create({
        expert: expertId,
        expertName: expert.name,
        name,
        email,
        phone,
        date,
        time,
        notes,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: slotAlreadyBookedMessage,
        });
      }

      throw error;
    }

    const updatedExpert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        "availableSlots.date": date,
        "availableSlots.time": time,
        "availableSlots.isBooked": false,
      },
      {
        $set: { "availableSlots.$.isBooked": true },
      },
      { new: true }
    );

    if (!updatedExpert) {
      await Booking.findByIdAndDelete(booking._id);

      return res.status(409).json({
        success: false,
        message: slotAlreadyBookedMessage,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return sendValidationError(res, "Email is required");
    }

    if (!emailRegex.test(email)) {
      return sendValidationError(res, "Please enter a valid email");
    }

    const bookings = await Booking.find({ email: email.toLowerCase().trim() }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendValidationError(res, "Invalid booking ID");
    }

    if (!bookingStatuses.includes(status)) {
      return sendValidationError(res, "Invalid booking status");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      message: "Booking status updated successfully.",
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
};
