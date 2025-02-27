const User = require("../models/User");
const Referral = require("../models/Referral");
const crypto = require("crypto");
require('dotenv').config();

exports.generateReferralLink = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (!user.referralCode) {
            user.referralCode = crypto.randomBytes(6).toString("hex"); 
            await user.save();
        }

        const referralLink = `http://localhost:${process.env.PORT || 4000}/api/auth/register/${user.referralCode}`;

        res.status(200).json({
            message: "Referral link generated successfully",
            referralLink,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.trackReferralClick = async (req, res) => {
    try {
        const { referralCode } = req.params;
        const visitorIP = req.ip;
        
        console.log(visitorIP);
        
        const referrer = await User.findOne({ referralCode });

        if (!referrer) {
            return res.status(404).json({ message: "Invalid referral code" });
        }


        const existingReferral = await Referral.findOne({
            referrerCode: referralCode,
            visitorIP: visitorIP, 
            status: "pending",
        });

        if (existingReferral) {
            return res.status(200).json({
                message: "Referral already tracked for this visitor",
                referralId: existingReferral._id,
            });
        }


        const referralEntry = new Referral({
            referrerCode: referralCode,
            referrerUser: referrer._id,
            visitorIP: visitorIP, 
            status: "pending",
        });

        await referralEntry.save();

        res.status(200).json({
            message: "Referral tracked successfully",
            referralId: referralEntry._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
