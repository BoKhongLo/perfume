import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SocketAdapter } from 'SocketAdapter';
import cors from 'cors-ts'
async function bootstrap() {
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://10.0.2.2:3000',
    'https://perfumedk.shop',
    'http://perfumedk.shop',
    'http://103.155.161.250:3000',
    'http://103.155.161.250:3001',
    'http://103.155.161.250:3002'
  ];
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: whitelist,
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true,
  });

  app.use(
    cors({
      origin: whitelist,
      optionsSuccessStatus: 200,
    })
  )
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(3434);
}
bootstrap();
