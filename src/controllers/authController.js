const User = require("../models/User");
const Referral = require("../models/Referral");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 


const generateReferralCode = () => crypto.randomBytes(4).toString("hex"); 



exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { referralCode } = req.params;
        const visitorIP = req.ip;


        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            referralCode: generateReferralCode()
        });


        if (referralCode) {
            const referrer = await User.findOne({ referralCode });

            if (referrer) {
                newUser.referredBy = referrer._id;
                referrer.referralCount += 1;
                referrer.rewardPoints += 10;
                await referrer.save();

                const referralEntry = await Referral.findOne({
                    referrerCode: referralCode,
                    visitorIP: visitorIP,
                    status: "pending",
                });

                console.log(referralEntry);
                

                if (referralEntry) {

                    referralEntry.status = "successful";
                    referralEntry.referredUser = newUser._id; 
                    await referralEntry.save();

                }
            } else {
                return res.status(400).json({ message: "Invalid referral code" });
            }
        }

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      
      console.log("Received emailOrUsername:", email, username);
  
      // Check if user exists
      const user = await User.findOne({
        $or: [
          { email: email?.trim().toLowerCase() },
          { username: username?.trim().toLowerCase() }
        ]
      });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
