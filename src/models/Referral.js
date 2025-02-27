const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
    referrerCode: {
        type: String,
        required: true
    },
    referrerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    referredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    visitorIP: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "successful"],
        default: "pending"
    },
    dateReferred: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Referral", ReferralSchema);
