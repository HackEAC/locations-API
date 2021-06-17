import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
