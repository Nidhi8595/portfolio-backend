import { Injectable }   from '@nestjs/common';
import { readFileSync } from 'fs';
import { join }         from 'path';

@Injectable()
export class CertificationsService {
  findAll() {
    const filePath = join(process.cwd(), 'src', 'data', 'certifications.json');
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
}