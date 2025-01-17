import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ProductsService } from './products/products.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Populating the db for the first time, comment this section if you want to avoid it
  console.log('Populating the db for the first time');
  const productService = app.get(ProductsService);
  await productService.fetchProductsFromContentful();
  // End populating db for the first time

  // Api docs config
  const options = new DocumentBuilder()
    .setTitle('Contentful Products API')
    .setDescription('API for managing products from Contentful')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
