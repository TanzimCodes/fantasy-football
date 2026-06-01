import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 SWAGGER SETUP - Add this block
  const config = new DocumentBuilder()
    .setTitle('Fantasy Football API')        // Your API's title
    .setDescription('API for fantasy football application') // Description
    .setVersion('1.0')                       // Version number
    .addTag('players', 'Operations about fantasy football players')
    .addTag('teams', 'Operations about user teams')
    .addTag('draft', 'Draft advice and recommendations')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the URL path
  // 👆 SWAGGER SETUP ENDS

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
