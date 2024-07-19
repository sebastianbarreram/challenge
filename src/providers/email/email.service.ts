import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import {
  EMAIL_SUBJECT,
  GMAIL_PASSWORD,
  GMAIL_USERNAME,
} from './constants/email.constants';

@Injectable()
export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: GMAIL_USERNAME,
        pass: GMAIL_PASSWORD,
      },
    });
  }

  private readonly logger = new Logger(EmailService.name);
  private transporter;

  async sendEmail(to: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"No Reply" <${GMAIL_USERNAME}>`,
        to,
        subject: EMAIL_SUBJECT,
        text,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
