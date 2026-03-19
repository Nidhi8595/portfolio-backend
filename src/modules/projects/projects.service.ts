import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

// @Injectable() marks this as a NestJS provider
// It can be injected into any controller that needs it
@Injectable()
export class ProjectsService {

  // Reads projects.json from the data folder and returns it
  // We read the file once and return the parsed JSON
  findAll() {
    const filePath = join(process.cwd(), 'src', 'data', 'projects.json');
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  // Returns a single project by id
  findOne(id: number) {
    const projects = this.findAll();
    return projects.find((p: any) => p.id === id) ?? null;
  }
}