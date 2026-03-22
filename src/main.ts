import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes will be /api/...
  // e.g. GET /api/projects, GET /api/skills
  app.setGlobalPrefix('api');
  // Handle preflight OPTIONS requests globally
app.use((req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

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
    methods:          ['GET', 'POST', 'OPTIONS'],
  allowedHeaders:   ['Content-Type', 'Accept', 'Authorization'],
  exposedHeaders:   ['Content-Type'],
  credentials:      true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
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