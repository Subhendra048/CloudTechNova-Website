//Load the tools
require('dotenv').config();       //.env file
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Fix for ENETUNREACH: force IPv4 DNS resolution

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Basic setup
app.use(cors());
app.use(express.json());

// Set up the gmail transporter (explicit host/port instead of "service: gmail" shorthand)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,          // comes from your .env file
    pass: process.env.GMAIL_APP_PASSWORD   // comes from your .env file
  }
});

// Create the "endpoint"
app.post('/send-message', async (req, res) => {
  const { fullName, company, email, phone, country, serviceInterest, message } = req.body;

  // Basic check
  if (!fullName || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  // Build the email
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.COMPANY_EMAIL,
    replyTo: email,
    subject: `New message from ${fullName} via CloudTechnova website`,
    text: `Name: ${fullName}
Company: ${company || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}
Country: ${country || 'N/A'}
Service Interested In: ${serviceInterest || 'N/A'}

Message:
${message}`
  };

  //Try to send it
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', process.env.COMPANY_EMAIL);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
  }
});

//backend server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});