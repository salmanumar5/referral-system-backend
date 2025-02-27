const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { generateReferralLink, trackReferralClick } = require("../controllers/referralController");

const router = express.Router();

// Generate referral link for the logged-in user
router.get("/generate", verifyToken, generateReferralLink);
router.get("/track/:referralCode", trackReferralClick);

module.exports = router;
