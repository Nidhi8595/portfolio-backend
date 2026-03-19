import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';

// @Controller('projects') means this handles routes at /api/projects
// (the /api prefix comes from main.ts setGlobalPrefix)
@Controller('projects')
export class ProjectsController {
  // NestJS injects ProjectsService automatically
  constructor(private readonly projectsService: ProjectsService) {}

  // GET /api/projects — returns all projects
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET /api/projects/1 — returns one project
  // ParseIntPipe converts the string "1" from the URL to a number
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const project = this.projectsService.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }
}