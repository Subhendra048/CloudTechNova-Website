//Load the tools
require('dotenv').config();       //.env file
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const app = express();

// Basic setup
app.use(cors());
app.use(express.json());

// Set up Resend (sends email over HTTPS, not SMTP — avoids Render's blocked SMTP ports)
const resend = new Resend(process.env.RESEND_API_KEY);

// Create the "endpoint"
app.post('/send-message', async (req, res) => {
  const { fullName, company, email, phone, country, serviceInterest, message } = req.body;

  // Basic check
  if (!fullName || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  // Build the email
  const textBody = `Name: ${fullName}
Company: ${company || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}
Country: ${country || 'N/A'}
Service Interested In: ${serviceInterest || 'N/A'}

Message:
${message}`;

  //Try to send it
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,   // must be a verified sender/domain in Resend
      to: process.env.COMPANY_EMAIL,
      replyTo: email,
      subject: `New message from ${fullName} via CloudTechnova website`,
      text: textBody
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
    }

    console.log('Email sent successfully to', process.env.COMPANY_EMAIL, '| id:', data?.id);
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