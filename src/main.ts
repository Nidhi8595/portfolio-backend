import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes will be /api/...
  // e.g. GET /api/projects, GET /api/skills
  app.setGlobalPrefix('api');

  // Enable CORS so your Angular app (localhost:4200) can call this API
  app.enableCors({
    origin: (origin, callback) => {
    const allowed = [
      'http://localhost:4200',       // Angular dev server
      'https://portfolio-backend-yltt.onrender.com'  // Replace with your deployed URL later
      ,'https://portfolio-gules-psi-64.vercel.app/',
          'https://portfolio-n00ocl1jn-neelakshis-projects.vercel.app',
      /\.vercel\.app$/,      // Allow all .vercel

    ]
    if (!origin) return callback(null, true); // allow server-to-server

    const isAllowed = allowed.some(pattern =>
      typeof pattern === 'string'
        ? pattern === origin
        : pattern.test(origin)
    );

    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Global validation pipe
  // Automatically validates request bodies against your DTO classes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Strips properties not in the DTO
      forbidNonWhitelisted: true,  // Throws error if unknown properties sent
      transform: true,      // Auto-converts types (string "1" → number 1)
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Portfolio API running on http://localhost:${port}/api`);
}

bootstrap();