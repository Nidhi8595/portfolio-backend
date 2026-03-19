import { Injectable } from '@nestjs/common';
import { ContactDto } from './contact.dto';

@Injectable()
export class ContactService {

  // For now we log and return success
  // Later you can add nodemailer or a mail API here
  async sendMessage(dto: ContactDto): Promise<{ success: boolean; message: string }> {

    // Log the message so you can see it in the terminal
    console.log('\n📬 New contact message received:');
    console.log(`   From:    ${dto.name} <${dto.email}>`);
    console.log(`   Message: ${dto.message}`);
    console.log(`   Time:    ${new Date().toLocaleString()}\n`);

    // Return success response
    return {
      success: true,
      message: 'Message received! I will get back to you soon.'
    };
  }
}