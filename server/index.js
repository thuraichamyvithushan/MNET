const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("WARNING: EMAIL_USER or EMAIL_PASS not set in .env file. Email sending will fail.");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const upload = require('multer')({ storage: require('multer').memoryStorage() });

app.post('/send-email', async (req, res) => {
    const { fullName, phone, email, description } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN_IT || 'thuraichamyvithushan19@gmail.com',
        subject: `IT Support Ticket - ${fullName}`,
        text: `
      New IT Support Ticket Received
      
      Name: ${fullName}
      Phone: ${phone}
      Contact Email: ${email}
      
      Issue Description:
      ${description}
    `,
        html: `
      <h2>New IT Support Ticket Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Contact Email:</strong> ${email}</p>
      <br/>
      <h3>Issue Description:</h3>
      <p>${description.replace(/\n/g, '<br>')}</p>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.toString() });
    }
});

app.post('/send-reimbursement', upload.single('receipt'), async (req, res) => {
    const { fullName, email, date, amount, description, department, notes } = req.body;
    const adminEmail = process.env.EMAIL_ADMIN_MNET || 'thuraichamyvithushan19@gmail.com'; // Target Finance Admin

    const mailOptions = {
        from: `"Mototrekkin Expense Claims" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: adminEmail,
        subject: `Reimbursement Claim - ${fullName} - $${amount}`,
        text: `
      New Reimbursement Request
      
      Name: ${fullName}
      Email: ${email}
      Date: ${date}
      Amount: $${amount}
      Department: ${department || 'N/A'}
      
      Description:
      ${description}

      Notes:
      ${notes || 'N/A'}
    `,
        html: `
      <h2>New Reimbursement Request</h2>
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Amount:</strong> <span style="font-size: 1.2em; color: #d97706;">$${amount}</span></p>
        <p><strong>Department:</strong> ${department || 'N/A'}</p>
        <hr/>
        <h3>Description</h3>
        <p>${description.replace(/\n/g, '<br>')}</p>
        <br/>
        <h3>Notes</h3>
        <p>${notes || 'N/A'}</p>
      </div>
    `,
        attachments: req.file ? [
            {
                filename: req.file.originalname,
                content: req.file.buffer
            }
        ] : []
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Reimbursement sent: ' + info.response);
        res.status(200).json({ message: 'Reimbursement request sent successfully!' });
    } catch (error) {
        console.error('Error sending reimbursement:', error);
        res.status(500).json({ message: 'Failed to send expense claim', error: error.toString() });
    }
});

app.post('/send-leave', async (req, res) => {
    const { fullName, email, leaveDate, reason } = req.body;
    const adminEmail = process.env.EMAIL_ADMIN_MNET || 'thuraichamyvithushan19@gmail.com';

    const mailOptions = {
        from: `"Mototrekkin Leave System" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: adminEmail,
        subject: `Leave Application - ${fullName}`,
        text: `
      New Leave Application
      
      Name: ${fullName}
      Email: ${email}
      Leave Date: ${leaveDate}
      
      Reason:
      ${reason}
    `,
        html: `
      <h2>New Leave Application</h2>
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Leave Date:</strong> ${leaveDate}</p>
        <hr/>
        <h3>Reason / Description</h3>
        <p>${reason.replace(/\n/g, '<br>')}</p>
      </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Leave app sent: ' + info.response);
        res.status(200).json({ message: 'Leave application sent successfully!' });
    } catch (error) {
        console.error('Error sending leave app:', error);
        res.status(500).json({ message: 'Failed to send leave application', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
