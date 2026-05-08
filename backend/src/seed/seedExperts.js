require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Expert = require("../models/Expert");

const slotTimes = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
const slotDates = ["2026-05-10", "2026-05-11", "2026-05-12", "2026-05-13"];

const createSlots = (offset = 0) =>
  slotTimes.map((time, index) => ({
    date: slotDates[(index + offset) % slotDates.length],
    time,
    isBooked: false,
  }));

const experts = [
  {
    name: "Dr. Ananya Sharma",
    category: "Career Coach",
    experience: 8,
    rating: 4.8,
    bio: "Helps students and professionals choose the right career path with practical, step-by-step guidance.",
    price: 999,
    availableSlots: createSlots(0),
  },
  {
    name: "Rohit Mehta",
    category: "Software Engineering",
    experience: 6,
    rating: 4.7,
    bio: "Frontend and backend mentor focused on job-ready engineering skills and interview preparation.",
    price: 799,
    availableSlots: createSlots(1),
  },
  {
    name: "Priya Nair",
    category: "Finance",
    experience: 10,
    rating: 4.9,
    bio: "Personal finance advisor helping users understand budgeting, investing, and long-term financial planning.",
    price: 1199,
    availableSlots: createSlots(2),
  },
  {
    name: "Kabir Malhotra",
    category: "Design",
    experience: 7,
    rating: 4.6,
    bio: "Product designer who reviews portfolios, UX case studies, and practical design workflows.",
    price: 899,
    availableSlots: createSlots(3),
  },
  {
    name: "Neha Kapoor",
    category: "Marketing",
    experience: 9,
    rating: 4.8,
    bio: "Digital marketing strategist specializing in growth campaigns, content planning, and brand positioning.",
    price: 1099,
    availableSlots: createSlots(0),
  },
  {
    name: "Arjun Iyer",
    category: "Software Engineering",
    experience: 11,
    rating: 4.9,
    bio: "Senior engineering mentor for system design, backend architecture, and technical leadership preparation.",
    price: 1499,
    availableSlots: createSlots(1),
  },
  {
    name: "Meera Sethi",
    category: "Career Coach",
    experience: 5,
    rating: 4.5,
    bio: "Career mentor helping early professionals improve resumes, confidence, and job search strategy.",
    price: 699,
    availableSlots: createSlots(2),
  },
  {
    name: "Sameer Khan",
    category: "Finance",
    experience: 12,
    rating: 4.7,
    bio: "Finance expert with experience in taxation basics, savings planning, and beginner investment decisions.",
    price: 999,
    availableSlots: createSlots(3),
  },
  {
    name: "Isha Rao",
    category: "Design",
    experience: 6,
    rating: 4.6,
    bio: "UI designer helping learners build polished interfaces, design systems, and presentation-ready portfolios.",
    price: 849,
    availableSlots: createSlots(0),
  },
  {
    name: "Vikram Bose",
    category: "Marketing",
    experience: 8,
    rating: 4.7,
    bio: "Marketing consultant focused on SEO, analytics, campaign testing, and customer acquisition basics.",
    price: 949,
    availableSlots: createSlots(1),
  },
];

const seedExperts = async () => {
  try {
    await connectDB();
    await Expert.deleteMany({});
    console.log("Existing experts deleted.");

    const insertedExperts = await Expert.insertMany(experts);

    console.log(`${insertedExperts.length} experts inserted successfully.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedExperts();
