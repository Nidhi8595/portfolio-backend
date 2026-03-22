import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto }     from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // POST /api/contact
  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() dto: ContactDto) {
      console.log('📬 Contact controller hit, body:', JSON.stringify(dto));
    return this.contactService.sendMessage(dto);
  }
}