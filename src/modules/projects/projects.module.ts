import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

// A NestJS module bundles together:
// - controllers (handle HTTP requests)
// - services (contain business logic)
// Think of it as a self-contained feature package
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}