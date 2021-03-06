import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { microserviceConfig } from './microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Customer Service')
    .setDescription('The customer API description')
    .setVersion('1.0')
    .addTag('customer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice(microserviceConfig);

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
