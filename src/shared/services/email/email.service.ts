import nodemailer from 'nodemailer';
import { envConfig } from '../../config/env-config';
import { logger } from '../../utils/logger';

interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: envConfig.email.emailHost,
            port: envConfig.email.emailPort,
            secure: envConfig.email.emailSecure,
            auth: {
                user: envConfig.email.emailUser,
                pass: envConfig.email.emailPassword,
            },
        } as nodemailer.TransportOptions);
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: envConfig.email.emailFrom,
                ...options,
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${options.to}`);
        } catch (error) {
            logger.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
        const subject = 'Password Reset Request';
        const text = `Please use the following link to reset your password: ${resetUrl}`;
        const html = `
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

        await this.sendEmail({ to, subject, text, html });
    }
}

export const emailService = new EmailService();
