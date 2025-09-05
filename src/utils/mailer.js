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
  const subject = "Your Legal Vault 2FA Code";
  const html = generateVerificationEmailHTML(code);
  const text = generateVerificationEmailText(code);

  const mailOptions = {
    from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const generateVerificationEmailText = (code) =>
  `Your Legal Vault verification code is: ${code}
This code is valid for only 5 minutes.

If you didn't request this, you can safely ignore this email.`;

const generateVerificationEmailHTML = (code) => `<!doctype html>
<html lang="en" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Legal Vault Verification</title>
  <style>
    /* Minimal mobile tweaks (Gmail supports inline best; keep this tiny) */
    @media (max-width: 480px) {
      .container { width: 100% !important; }
      .code { font-size: 28px !important; letter-spacing: 6px !important; }
      .btn { display:block !important; width:100% !important; }
      .p-24 { padding:20px !important; }
    }
    /* Dark mode helpers (many clients auto-invert; keep colors subtle) */
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;">
  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your Legal Vault verification code: ${code}. Expires in 5 minutes.
  </div>

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fb;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Card -->
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 6px 24px rgba(18,38,63,0.08);overflow:hidden;">
          <!-- Header / Brand -->
          <tr>
            <td style="background:linear-gradient(135deg,#2f6fee,#7b9dff);padding:28px 24px;text-align:left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.3;color:#eaf0ff;font-weight:600;">
                    Legal Vault
                  </td>
                  <td align="right" style="font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#eaf0ff;opacity:.9;">
                    Secure Sign-In
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="p-24" style="padding:28px 32px 8px 32px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2a37;">
              <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;font-weight:700;color:#111827;">
                Your verification code
              </h1>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155;">
                Use the 6-digit code below to finish signing in to the <strong>Legal Vault</strong>. This code expires in <strong>5 minutes</strong>.
              </p>

              <!-- Code box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 8px 0;">
                <tr>
                  <td align="center" style="background:#0f172a;background:linear-gradient(180deg,#0f172a,#111827);border-radius:12px;padding:22px;">
                    <div class="code" style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-weight:700;font-size:32px;letter-spacing:10px;color:#ffffff;">
                      ${String(code).replace(/\s+/g, "")}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Tips -->
              <p style="margin:0 0 10px 0;font-size:12px;line-height:1.6;color:#64748b;">
                Didn’t request this code? You can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #e5e7eb;">
                <tr>
                  <td style="padding-top:14px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">
                    <div style="margin-bottom:6px;">
                      This is an automated message—please do not reply.
                    </div>
                    <div style="font-size:11px;color:#94a3b8;">
                      © ${new Date().getFullYear()} Legal Vault. All rights reserved.
                    </div>
                  </td>
                  <td align="right" style="padding-top:14px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#94a3b8;">
                    <a href="#" style="color:#6b7280;text-decoration:underline;">Security</a> ·
                    <a href="#" style="color:#6b7280;text-decoration:underline;">Privacy</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->
      </td>
    </tr>
  </table>
</body>
</html>`;

export const sendResetLink = async (toEmail, link) => {
  const subject = "Password Reset Request - Legal Vault";
  const html = generateResetEmailHTML(link);
  const text = `You requested to reset your Legal Vault password.

Click the link below to reset your password:
${link}

If you did not request this, please ignore this email.`;

  const mailOptions = {
    from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const generateResetEmailHTML = (link) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Password Reset</title>
  <style>
    @media (max-width: 480px) {
      .container { width: 100% !important; }
      .btn { display:block !important; width:100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table class="container" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 6px 24px rgba(18,38,63,0.08);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2f6fee,#7b9dff);padding:24px 32px;color:#ffffff;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:20px;font-weight:bold;">Legal Vault</div>
              <div style="font-size:12px;opacity:.9;">Secure Account Access</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;">Reset Your Password</h1>
              <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                You requested a password reset for your <strong>Legal Vault</strong> account. Click the button below to create a new password:
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px auto; text-align:center;">
          <tr>
            <td align="center">
              <a href="${link}" class="btn" style="background:#2f6fee;border-radius:10px;padding:12px 20px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;display:inline-block;text-align:center;box-shadow:0 4px 16px rgba(47,111,238,0.24);">
                Reset Password
               </a>
            </td>
          </tr>
          </table>

              <p style="margin:16px 0 8px;font-size:12px;color:#64748b;line-height:1.6;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>
              <p style="word-break:break-all;font-size:12px;color:#2563eb;">
                ${link}
              </p>
              <p style="margin-top:16px;font-size:12px;color:#64748b;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 28px;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:center;">
              © ${new Date().getFullYear()} Legal Vault. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Case Creation notification email
export const sendCaseCreationNotification = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending case creation notification:", error);
  }
};

export const sendCaseUpdateNotification = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Legal Vault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending case update notification:", error);
  }
};