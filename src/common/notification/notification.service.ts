import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
    private transporter: nodemailer.Transporter;

    private from_email = '';

    constructor(private configService: ConfigService) {
        // Create a transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>("EMAIL_HOST"),
            secure: false, // true for 465, false for other ports
            port: Number(this.configService.get<number>("EMAIL_PORT")),
            auth: {
                user: this.configService.get<string>("EMAIL_USERNAME") ?? process.env.MAIL_USER,
                pass: this.configService.get<string>("EMAIL_PASSWORD") ?? process.env.MAIL_PASS,
            },
        });
        this.from_email = this.configService.get<string>("EMAIL_FROM") || process.env.EMAIL_FROM || '';
    }

    /**
     * Sends an email using the configured transporter.
     * @param to - The recipient's email address.
     * @param subject - The subject of the email.
     * @param html - The HTML content of the email.
     */
    // send mail function with or without html template
    async sendMailWithTemplate(to: string, subject: string, template: string, context: Record<string, any>): Promise<void> {
        try {
            const html = this.renderTemplate(template, context);
            await this.sendMail(to, subject, html);
        } catch (err) {
            console.error('Email error:', err);
            throw new InternalServerErrorException('Failed to send email with template');
        }
    }

    /**
     * Renders a simple template by replacing {{key}} with context values.
     * @param template - The template string containing {{key}} placeholders.
     * @param context - The context object with values to replace in the template.
     * @returns The rendered HTML string.
     */
    private renderTemplate(template: string, context: Record<string, any>): string {
        return template.replace(/{{\s*([^}]+)\s*}}/g, (match, key) => {
            return context[key.trim()] ?? '';
        });
    }


    async sendMail(to: string, subject: string, html: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: this.from_email || this.configService.get<string>("EMAIL_FROM") || process.env.EMAIL_FROM,
                to,
                subject,
                html,
            });
        } catch (err) {
            console.error('Email error:', err);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
