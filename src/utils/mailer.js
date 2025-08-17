import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (toEmail, code) => {
  const mailOptions = {
    from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Legal Vault 2FA Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p> <p>This code is valid for only 5 minutes.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetLink = async (toEmail, link) => {
  const mailOptions = {
    from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Request",
    text: `Click the link below to reset your password:\n${link}`,
    html: `<p>Click the link below to reset your password:</p> <a href="${link}">Reset Link</a>`,
  };

  return transporter.sendMail(mailOptions);
};
