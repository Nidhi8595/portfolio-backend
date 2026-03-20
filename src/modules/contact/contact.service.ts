import { Injectable, Logger }   from '@nestjs/common';
import { ConfigService }        from '@nestjs/config';
import { ContactDto }           from './contact.dto';
import * as nodemailer          from 'nodemailer';

@Injectable()
export class ContactService {

  private readonly logger      = new Logger(ContactService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
 // Temporary debug — remove after confirming
  console.log('GMAIL_USER:', this.configService.get('GMAIL_USER'));
  console.log('GMAIL_PASS:', this.configService.get('GMAIL_PASS') ? 'LOADED' : 'MISSING');
    // Create reusable transporter using Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
      tls: {
    rejectUnauthorized: false  // ← add this if getting TLS errors
  }
    });
  }

  async sendMessage(dto: ContactDto): Promise<{ success: boolean; message: string }> {
    const recipient = this.configService.get<string>('RECIPIENT_EMAIL');
    const sender    = this.configService.get<string>('GMAIL_USER');

    try {
      // Email YOU receive — the visitor's message
      await this.transporter.sendMail({
        from:    `"Portfolio Contact" <${sender}>`,
        to:      recipient,
        subject: `📬 New message from ${dto.name} — Portfolio`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">

            <div style="background: linear-gradient(135deg, #2479ad, #7c3aed);
                        padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 1.4rem;">
                📬 New Portfolio Message
              </h1>
            </div>

            <div style="background: #f9fafb; padding: 24px;
                        border: 1px solid #e5e7eb; border-top: none;
                        border-radius: 0 0 12px 12px;">

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;
                              font-size: 0.85rem; width: 80px;">
                    Name
                  </td>
                  <td style="padding: 10px 0; font-weight: 600; color: #111827;">
                    ${dto.name}
                  </td>
                </tr>
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280; font-size: 0.85rem;">
                    Email
                  </td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${dto.email}"
                       style="color: #7c3aed; text-decoration: none;">
                      ${dto.email}
                    </a>
                  </td>
                </tr>
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280;
                              font-size: 0.85rem; vertical-align: top;">
                    Message
                  </td>
                  <td style="padding: 10px 0; color: #111827;
                              line-height: 1.6; white-space: pre-wrap;">
                    ${dto.message}
                  </td>
                </tr>
              </table>

              <div style="margin-top: 20px; padding-top: 16px;
                          border-top: 1px solid #e5e7eb;">
                <a href="mailto:${dto.email}?subject=Re: Your message on my portfolio"
                   style="display: inline-block; background: #7c3aed;
                          color: white; padding: 10px 20px;
                          border-radius: 8px; text-decoration: none;
                          font-weight: 600; font-size: 0.9rem;">
                  Reply to ${dto.name}
                </a>
              </div>

            </div>
          </div>
        `,
      });

      // Auto-reply to the person who contacted you
      await this.transporter.sendMail({
        from:    `"Neelakshi" <${sender}>`,
        to:      dto.email,
        subject: `Got your message! — Neelakshi`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">

            <div style="background: linear-gradient(135deg, #2479ad, #7c3aed);
                        padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 1.4rem;">
                Hey ${dto.name}! 👋
              </h1>
            </div>

            <div style="background: #f9fafb; padding: 24px;
                        border: 1px solid #e5e7eb; border-top: none;
                        border-radius: 0 0 12px 12px;">

              <p style="color: #374151; line-height: 1.7; margin-top: 0;">
                Thanks for reaching out through my portfolio!
                I've received your message and will get back
                to you as soon as possible — usually within 24 hours.
              </p>

              <div style="background: #fff; border: 1px solid #e5e7eb;
                          border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 0.82rem;
                           margin: 0 0 8px 0; text-transform: uppercase;
                           letter-spacing: 0.06em;">
                  Your message
                </p>
                <p style="color: #374151; margin: 0;
                           line-height: 1.6; white-space: pre-wrap;">
                  ${dto.message}
                </p>
              </div>

              <p style="color: #374151; line-height: 1.7;">
                In the meantime feel free to check out my work:
              </p>

              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="https://github.com/Nidhi8595"
                   style="color: #7c3aed; text-decoration: none;
                           font-weight: 600;">GitHub →</a>
                <a href="https://www.linkedin.com/in/neelakshi-2b3725321/"
                   style="color: #7c3aed; text-decoration: none;
                           font-weight: 600;">LinkedIn →</a>
              </div>

              <p style="color: #6b7280; font-size: 0.85rem;
                         margin-top: 24px; padding-top: 16px;
                         border-top: 1px solid #e5e7eb;">
                — Neelakshi<br>
                Full Stack Developer
              </p>
            </div>
          </div>
        `,
      });

      this.logger.log(`✅ Email sent successfully from ${dto.name} <${dto.email}>`);

      return {
        success: true,
        message: `Message received! I'll get back to you at ${dto.email} soon.`
      };

    } catch (error) {
      this.logger.error('❌ Failed to send email:', error);

      return {
        success: false,
        message: 'Something went wrong sending the email. Please try again or email me directly.'
      };
    }
  }
}