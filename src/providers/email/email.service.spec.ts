import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

jest.mock('./constants/email.constants', () => ({
  EMAIL_SUBJECT: 'Test Subject',
  GMAIL_PASSWORD: 'testpassword',
  GMAIL_USERNAME: 'testuser@gmail.com',
}));

jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let sendMailMockStub: jest.Mock;

  beforeAll(() => {
    sendMailMockStub = jest.fn().mockResolvedValue({ messageId: '12345' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMockStub,
    });

    emailService = new EmailService();
  });

  it('should send an email successfully', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    await emailService.sendEmail('test@example.com', 'Test message');

    expect(sendMailMockStub).toHaveBeenCalledWith({
      from: '"No Reply" <testuser@gmail.com>',
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    });
    expect(loggerSpy).toHaveBeenCalledWith('Email sent: 12345');
  });

  it('should log an error if sending email fails', async () => {
    const error = new Error('Test error');
    sendMailMockStub.mockRejectedValueOnce(error);
    const errorSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(
      emailService.sendEmail('test@example.com', 'Test message'),
    ).rejects.toThrow('Test error');
    expect(errorSpy).toHaveBeenCalledWith('Error sending email: Test error');
  });
});
