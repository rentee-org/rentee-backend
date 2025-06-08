import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { NotificationService } from './notification.service';

jest.mock('nodemailer');

describe('NotificationService', () => {
  let service: NotificationService;
  let configService: ConfigService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    configService = {
      get: jest.fn((key: string) => {
        const mockConfig = {
          EMAIL_HOST: 'smtp.example.com',
          EMAIL_PORT: 587,
          EMAIL_USERNAME: 'test@example.com',
          EMAIL_PASSWORD: 'password',
          EMAIL_FROM: 'no-reply@example.com',
        };
        return mockConfig[key];
      }),
    } as unknown as ConfigService;

    service = new NotificationService(configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with a template', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Email';
    const template = 'Hello {{name}}';
    const context = { name: 'John' };

    await service.sendMailWithTemplate(to, subject, template, context);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'no-reply@example.com',
      to,
      subject,
      html: 'Hello John',
    });
  });

  it('should send an email', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Email';
    const html = '<p>Hello World</p>';

    await service.sendMail(to, subject, html);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'no-reply@example.com',
      to,
      subject,
      html,
    });
  });

  it('should throw an error if email sending fails', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP Error'));

    await expect(
      service.sendMail('recipient@example.com', 'Test Email', '<p>Hello</p>'),
    ).rejects.toThrow('Failed to send email');
  });
});
