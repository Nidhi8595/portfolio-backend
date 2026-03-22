import { Injectable, Logger } from '@nestjs/common';
import { ConfigService }      from '@nestjs/config';
import { ContactDto }         from './contact.dto';
import { Resend }             from 'resend';

@Injectable()
export class ContactService {

  private readonly logger = new Logger(ContactService.name);
  private readonly resend: Resend;
  private readonly recipient: string;
  private readonly senderName = 'Neelakshi Portfolio';

  constructor(private configService: ConfigService) {
    const apiKey       = this.configService.get<string>('RESEND_API_KEY');
    this.recipient     = this.configService.get<string>('RECIPIENT_EMAIL')
                         ?? 'neelakshikadyan@gmail.com';

    this.resend = new Resend(apiKey);

    console.log('=== RESEND INIT ===');
    console.log('API KEY:   ', apiKey ? 'LOADED ✅' : 'MISSING ❌');
    console.log('RECIPIENT: ', this.recipient);
    console.log('==================');
  }

  async sendMessage(dto: ContactDto): Promise<{ success: boolean; message: string }> {

    console.log('📨 sendMessage called for:', dto.email);

    try {

      // Email YOU receive
      await this.resend.emails.send({
        from:    `${this.senderName} <onboarding@resend.dev>`,
        to:      [this.recipient],
        subject: `📬 New message from ${dto.name} — Portfolio`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#2479ad,#7c3aed);
                        padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:1.4rem;">
                📬 New Portfolio Message
              </h1>
            </div>
            <div style="background:#f9fafb;padding:24px;
                        border:1px solid #e5e7eb;border-top:none;
                        border-radius:0 0 12px 12px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;color:#6b7280;
                             font-size:0.85rem;width:80px;">Name</td>
                  <td style="padding:10px 0;font-weight:600;
                             color:#111827;">${dto.name}</td>
                </tr>
                <tr style="border-top:1px solid #e5e7eb;">
                  <td style="padding:10px 0;color:#6b7280;
                             font-size:0.85rem;">Email</td>
                  <td style="padding:10px 0;">
                    <a href="mailto:${dto.email}"
                       style="color:#7c3aed;text-decoration:none;">
                      ${dto.email}
                    </a>
                  </td>
                </tr>
                <tr style="border-top:1px solid #e5e7eb;">
                  <td style="padding:10px 0;color:#6b7280;
                             font-size:0.85rem;vertical-align:top;">
                    Message
                  </td>
                  <td style="padding:10px 0;color:#111827;
                             line-height:1.6;white-space:pre-wrap;">
                    ${dto.message}
                  </td>
                </tr>
              </table>
              <div style="margin-top:20px;padding-top:16px;
                          border-top:1px solid #e5e7eb;">
                <a href="mailto:${dto.email}?subject=Re: Your portfolio message"
                   style="display:inline-block;background:#7c3aed;color:white;
                          padding:10px 20px;border-radius:8px;
                          text-decoration:none;font-weight:600;">
                  Reply to ${dto.name}
                </a>
              </div>
            </div>
          </div>
        `,
      });

      // Auto-reply to visitor
      await this.resend.emails.send({
        from:    `Neelakshi <onboarding@resend.dev>`,
        to:      [dto.email],
        subject: `Got your message! — Neelakshi`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#2479ad,#7c3aed);
                        padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:1.4rem;">
                Hey ${dto.name}! 👋
              </h1>
            </div>
            <div style="background:#f9fafb;padding:24px;
                        border:1px solid #e5e7eb;border-top:none;
                        border-radius:0 0 12px 12px;">
              <p style="color:#374151;line-height:1.7;margin-top:0;">
                Thanks for reaching out through my portfolio!
                I've received your message and will get back
                to you soon — usually within 24 hours.
              </p>
              <div style="background:#fff;border:1px solid #e5e7eb;
                          border-radius:8px;padding:16px;margin:20px 0;">
                <p style="color:#6b7280;font-size:0.82rem;
                           margin:0 0 8px 0;text-transform:uppercase;
                           letter-spacing:0.06em;">Your message</p>
                <p style="color:#374151;margin:0;
                           line-height:1.6;white-space:pre-wrap;">
                  ${dto.message}
                </p>
              </div>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <a href="https://github.com/Nidhi8595"
                   style="color:#7c3aed;text-decoration:none;font-weight:600;">
                  GitHub →
                </a>
                <a href="https://www.linkedin.com/in/neelakshi-2b3725321/"
                   style="color:#7c3aed;text-decoration:none;font-weight:600;">
                  LinkedIn →
                </a>
              </div>
              <p style="color:#6b7280;font-size:0.85rem;margin-top:24px;
                         padding-top:16px;border-top:1px solid #e5e7eb;">
                — Neelakshi<br>Full Stack Developer
              </p>
            </div>
          </div>
        `,
      });

      this.logger.log(`✅ Email sent to ${this.recipient} and auto-reply to ${dto.email}`);

      return {
        success: true,
        message: `Message received! I'll get back to you at ${dto.email} soon.`
      };

    } catch (error: any) {
      console.log('RESEND ERROR:', error?.message ?? JSON.stringify(error));
      return {
        success: false,
        message: 'Something went wrong. Please email me directly at neelakshikadyan@gmail.com'
      };
    }
  }
}