require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

app.post("/send-sms", async (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: "Missing phoneNumber or message" });
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber,
        });

        res.status(200).json({ success: true, message: "SMS sent successfully!", response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
