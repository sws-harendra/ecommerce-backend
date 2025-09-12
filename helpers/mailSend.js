const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

async function sendmail(templateName, templateData, to, subject) {
  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465, // Use 587 for STARTTLS
      secure: false, // false for STARTTLS
      auth: {
        user: process.env.EMAILID,
        pass: process.env.PASSWORD,
      },
      secure: true,
      tls: {
        // Allow TLS
        rejectUnauthorized: false,
      },
    });

    // Read the email template file
    const templatePath = path.join(__dirname, "../templates", templateName);
    const source = fs.readFileSync(templatePath, "utf8");

    // Compile the template
    const template = handlebars.compile(source);
    const html = template(templateData);

    // Setup email data
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Your Store"}" <${
        process.env.EMAILID
      }>`,
      to,
      subject,
      html,
      // You can also add a text version for email clients that don't support HTML
      text: `Thank you for your order #${
        templateData.order?.id || ""
      }. Please find your order details below.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

module.exports = { sendmail };
