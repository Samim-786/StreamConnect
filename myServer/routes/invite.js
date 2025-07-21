// routes/invite.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { emails, roomName } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0 || !roomName) {
    return res.status(400).json({ error: 'Missing emails or roomName' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,         // e.g. your-email@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD, // App password from Google
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: emails,
    subject: `You're invited to join a meeting`,
    html: `
      <p>You’ve been invited to join a video meeting.</p>
      <p><strong>Room Name:</strong> ${roomName}</p>
      <p>Please open the app and use this room name to join the meeting.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invitations sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send invites' });
  }
});

module.exports = router;
