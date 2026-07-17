import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private sender: string;

  constructor(private configService: ConfigService) {
    this.sender = this.configService.getOrThrow<string>('SMTP_USER');
    this.transporter = createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      secure: true,
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async onModuleInit() {
    await this.verifyConnection();
  }

  async verifyConnection() {
    await this.transporter.verify();
    this.logger.log('SMTP connected');
  }

  sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: this.sender,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const verificationUrl = `${clientUrl}/api/auth/verify-email?token=${token}`;

    await this.sendEmail(
      email,
      'Verify your email',
      `
      <h2> Welcome to notey</h2>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <a href="${verificationUrl}">Verify email</a>
      <p>If you didn't create an account, you can ignore this email</p>
      `,
    );
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    const resetUrl = `${clientUrl}/auth/reset-password?token=${token}`;

    await this.sendEmail(
      email,
      'Verify your email',
      `
      <h2> Welcome to notey</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}">Reset password</a>
      <p>If you didn't request for a password reset, you can ignore this email</p>
      `,
    );
  }
}
