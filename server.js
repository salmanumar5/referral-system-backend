require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();

const PORT = process.env.PORT || 4000


app.use(cors());
app.use(express.json());


const authRoute = require('./src/routes/authRotues')
const refRoute = require('./src/routes/referralRoutes')


app.use("/api/auth", authRoute);
app.use("/api/referral", refRoute);


connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    
})