import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, //
    }),
  );

  const config = app.get(ConfigService);
  const port = Number(config.get("PORT") ?? 3001);

  app.enableCors({
    origin: ["http://localhost:3000"],
  });
  
  const swaggerTitle = config.get("SWAGGER_TITLE") ?? "WENLOCK API";
  const swaggerDesc = config.get("SWAGGER_DESC") ?? "CRUD de usuários";
  const swaggerVersion = config.get("SWAGGER_VERSION") ?? "1.0.0";

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDesc)
    .setVersion(swaggerVersion)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(port);

  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger on http://localhost:${port}/api`);
}

bootstrap();
