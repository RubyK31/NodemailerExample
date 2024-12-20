const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const db = require('./db/connection');  // Database connection file
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Email Sending Endpoint
app.post('/send-email', (req, res) => {
    const { recipient, name, imageUrl } = req.body;

    // Fetch HTML template from DB
    const query = 'SELECT * FROM email_template WHERE template_name = "Welcome" LIMIT 1';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        const template = results[0];
        
        // Dynamically replace placeholders in the template
        let htmlBody = template.body.replace('{{name}}', name);
        htmlBody = htmlBody.replace('{{imageUrl}}', imageUrl);  // Add dynamic image

        // Configure Mailtrap Transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        // Mail Options
        const mailOptions = {
            from: '"Your Service" <no-reply@yourservice.com>',
            to: recipient,
            subject: template.subject,
            html: htmlBody,
        };

        // Send Email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Email sending failed', details: error });
            }

            res.status(200).json({ message: 'Email sent successfully', info });
        });
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
