const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Registration with optional referral code
router.post("/register/:referralCode?", register);
router.post("/login", login);

module.exports = router;
