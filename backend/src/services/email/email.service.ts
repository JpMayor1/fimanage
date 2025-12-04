import dotenv from "dotenv";
dotenv.config();

import { AppError } from "@/utils/error/appError";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  recoveryCode: string,
  firstName: string
): Promise<void> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new AppError("Email service is not configured.", 500);
    }

    const frontendUrl =
      process.env.FRONTEND_URLS?.split(",")[0] || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/auth/reset-password?code=${recoveryCode}&email=${encodeURIComponent(
      email
    )}`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Fimanage <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request - Fimanage",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 28px;">Fimanage</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <h2 style="color: #333; margin-top: 0;">Hello ${firstName},</h2>
              <p>We received a request to reset your password for your Fimanage account.</p>
              <p>Your recovery code is:</p>
              <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 4px; font-family: monospace;">${recoveryCode}</h1>
              </div>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                <strong>Important:</strong> This code will expire in 5 minutes. If you didn't request this password reset, please ignore this email.
              </p>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new AppError("Failed to send password reset email.", 500);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Error sending password reset email:", error);
    throw new AppError("Failed to send password reset email.", 500);
  }
};
