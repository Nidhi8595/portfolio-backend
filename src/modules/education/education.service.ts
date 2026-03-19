import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join }         from 'path';

@Injectable()
export class EducationService {
  findAll() {
    const filePath = join(process.cwd(), 'src', 'data', 'education.json');
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
}