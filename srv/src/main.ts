import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('Database URL:', process.env.APP_PG_URL);

async function bootstrap() {
  console.log(`Running in ${process.env.NODE_ENV} mode.`);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
