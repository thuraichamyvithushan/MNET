const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const { generateSafetyReportHtml } = require('./emailTemplates');

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
    const adminEmail = process.env.EMAIL_ADMIN_MNET || 'accounts@mototrekkin.com.au';

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
    const { fullName, email, startDate, endDate, startTime, endTime, reason } = req.body;
    const adminEmail = process.env.EMAIL_ADMIN_MNET || 'accounts@mototrekkin.com.au';

    const mailOptions = {
        from: `"Mototrekkin Leave System" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: adminEmail,
        subject: `Leave Application - ${fullName}`,
        text: `
      New Leave Application
      
      Name: ${fullName}
      Email: ${email}
      
      From: ${startDate} at ${startTime}
      To:   ${endDate} at ${endTime}
      
      Reason:
      ${reason}
    `,
        html: `
      <h2>New Leave Application</h2>
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <p><strong>From:</strong> ${startDate} @ ${startTime}</p>
        <p><strong>To:</strong> ${endDate} @ ${endTime}</p>
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

app.post('/send-leave-approval', async (req, res) => {
    const { email, fullName, startDate, endDate } = req.body;

    const mailOptions = {
        from: `"Mototrekkin Leave System" <${process.env.EMAIL_USER}>`,
        to: email, // Send to the user
        subject: `Leave Request Approved - ${fullName}`,
        text: `
      Dear ${fullName},

      Your leave request has been APPROVED.

      Details:
      From: ${startDate}
      To:   ${endDate}

      Enjoy your leave!
      
      Best regards,
      Mototrekkin Admin
    `,
        html: `
      <h2>Leave Request Approved</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Your leave request has been <strong style="color: green;">APPROVED</strong>.</p>
      <hr/>
      <p><strong>From:</strong> ${startDate}</p>
      <p><strong>To:</strong> ${endDate}</p>
      <hr/>
      <p>Enjoy your leave!</p>
      <br/>
      <p>Best regards,<br/>Mototrekkin Admin</p>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Approval email sent: ' + info.response);
        res.status(200).json({ message: 'Approval email sent successfully!' });
    } catch (error) {
        console.error('Error sending approval email:', error);
        res.status(500).json({ message: 'Failed to send approval email', error: error.toString() });
    }
});

app.post('/send-leave-rejection', async (req, res) => {
    const { email, fullName, startDate, endDate, reason } = req.body;

    const mailOptions = {
        from: `"Mototrekkin Leave System" <${process.env.EMAIL_USER}>`,
        to: email, // Send to the user
        subject: `Leave Request Rejected - ${fullName}`,
        text: `
      Dear ${fullName},

      We regret to inform you that your leave request has been REJECTED.

      Details:
      From: ${startDate}
      To:   ${endDate}
      Reason: ${reason || 'Not specified'}

      Please contact your manager for more information.
      
      Best regards,
      Mototrekkin Admin
    `,
        html: `
      <h2>Leave Request Rejected</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>We regret to inform you that your leave request has been <strong style="color: red;">REJECTED</strong>.</p>
      <hr/>
      <p><strong>From:</strong> ${startDate}</p>
      <p><strong>To:</strong> ${endDate}</p>
      <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
      <hr/>
      <p>Please contact your manager for more information.</p>
      <br/>
      <p>Best regards,<br/>Mototrekkin Admin</p>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Rejection email sent: ' + info.response);
        res.status(200).json({ message: 'Rejection email sent successfully!' });
    } catch (error) {
        console.error('Error sending rejection email:', error);
        res.status(500).json({ message: 'Failed to send rejection email', error: error.toString() });
    }
});



app.post('/send-safety-report', upload.array('attachments', 5), async (req, res) => {
    const {
        fullName, email, phone, department, issueType,
        location, date, time, title, description,
        severity, isInjured, reportedBefore, immediateAction
    } = req.body;

    const safetyEmail = process.env.EMAIL_ADMIN_MNET || 'accounts@mototrekkin.com.au';

    const htmlContent = generateSafetyReportHtml(req.body);

    const mailOptions = {
        from: `"Mototrekkin Safety System" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: safetyEmail,
        subject: `SAFETY REPORT [${severity.toUpperCase()}]: ${title}`,
        text: `
      NEW SAFETY ISSUE REPORTED
      
      Reporter: ${fullName} (${email}, ${phone})
      Dept: ${department || 'N/A'}
      
      Issue: ${title}
      Type: ${issueType}
      Severity: ${severity}
      Location: ${location}
      Date/Time: ${date} ${time || ''}
      
      Injuries? ${isInjured === 'true' ? 'YES' : 'No'}
      Immediate Action? ${immediateAction === 'true' ? 'YES' : 'No'}
      
      Description:
      ${description}
    `,
        html: htmlContent,
        attachments: (req.files || []).map(file => ({
            filename: file.originalname,
            content: file.buffer
        }))
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Safety report sent: ' + info.response);
        res.status(200).json({ message: 'Safety report submitted successfully!' });
    } catch (error) {
        console.error('Error sending safety report:', error);
        res.status(500).json({ message: 'Failed to send safety report', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
