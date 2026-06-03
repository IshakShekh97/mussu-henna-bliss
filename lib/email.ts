import nodemailer from "nodemailer";

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Reusable server-side utility to send emails via Nodemailer SMTP configuration.
 * Reads configurations directly from environment variables.
 */
export async function sendEmail({ to, subject, html }: SendMailParams) {
  try {
    const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const smtpPort = Number((process.env.SMTP_PORT || "587").trim());
    const smtpUser = (process.env.SMTP_USER || "").trim();
    const smtpPass = (process.env.SMTP_PASS || "").trim();
    const smtpSecure = (process.env.SMTP_SECURE || "false").trim() === "true";

    if (!smtpUser || !smtpPass) {
      console.warn(
        "[SMTP NodeMailer] Ignored: SMTP_USER and SMTP_PASS environment variables are not configured."
      );
      return { success: false, error: "SMTP credentials are not configured in environment variables." };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Mussu's Henna Bliss" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log(`[SMTP NodeMailer] Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[SMTP NodeMailer] Failed to transmit email to ${to}:`, error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}
