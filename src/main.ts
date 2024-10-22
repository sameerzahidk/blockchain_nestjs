import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configure Handlebars
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views')); // Ensure the path is correct
  app.setViewEngine('hbs'); // Set Handlebars as the view engine
  
  await app.listen(3000);
}
bootstrap();