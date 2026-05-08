const mongoose = require("mongoose");
const Expert = require("../models/Expert");

const getExperts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 6, 1);
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const [experts, total] = await Promise.all([
      Expert.find(filter)
        .select("_id name category experience rating price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Expert.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: experts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expert ID",
      });
    }

    const expert = await Expert.findById(id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found",
      });
    }

    res.json({
      success: true,
      data: expert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperts,
  getExpertById,
};
