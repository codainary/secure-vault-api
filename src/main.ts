import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TrimPipe } from './common/pipes/trim.pipe';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(LoggerService);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(logger);
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const config = new DocumentBuilder()
    .setTitle('Secure Vault API')
    .setDescription('API para gestión segura de credenciales cifradas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
