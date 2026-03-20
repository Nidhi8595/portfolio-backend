import { Module } from '@nestjs/common';
import { ProjectsModule } from './modules/projects/projects.module';
import { SkillsModule } from './modules/skills/skills.module';
import { EducationModule } from './modules/education/education.module';
import { CertificationsModule } from './modules/certifications/certifications.module';
import { ContactModule } from './modules/contact/contact.module';
import { ConfigModule }         from '@nestjs/config';


// AppModule is the root module — it imports every feature module
// NestJS reads this file to understand the entire application structure
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectsModule,
    SkillsModule,
    EducationModule,
    CertificationsModule,
    ContactModule
    // We will add EducationModule, ContactModule here in later steps
  ],
})
export class AppModule {}