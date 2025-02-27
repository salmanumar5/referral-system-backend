const express = require("express");
const { register, login, requestPasswordReset, resetPassword } = require("../controllers/authController");

const router = express.Router();


router.post("/register/:referralCode?", register);
router.post("/login", login);
router.post("/request-password-reset", requestPasswordReset); // Request reset link
router.post("/reset-password/:token", resetPassword); //

module.exports = router;
