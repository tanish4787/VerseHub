import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ to, subject, html }) => {
    try {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      return data;
    } catch (error) {
      console.error("Resend email error:", error);
      throw new Error("Email delivery failed");
    }
  },
};

export default transporter;
