import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SkillsService {
  findAll() {
    const filePath = join(process.cwd(), 'src', 'data', 'skills.json');
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
}