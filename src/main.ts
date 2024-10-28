import {
  HttpStatus
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });

  const config = new DocumentBuilder()
    .setTitle('InterLock')
    .setDescription('Api do InterLock')
    .setVersion('1.0')
    //.addServer(`${process.env.BASE_PATH}`)
    .addTag('interlock')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs`, app, document);

app.enableCors({
    origin: [
      ...['http://localhost:5177', 'http://localhost:80'],
      ...['http://interlock-frontend:5177', 'http://interlock-frontend:80'],
      ...[
        '159.112.191.8',
        'http://159.112.191.8',
        'http://159.112.191.8:5177',
        'http://159.112.191.8:80',
      ],   
    ],
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'UPDATE',
      'OPTIONS',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: HttpStatus.NO_CONTENT,
  });

  await app.listen(process.env.INTERLOCK_PORT);
}

bootstrap();

