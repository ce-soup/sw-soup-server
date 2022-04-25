import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerOptions: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('soup service server')
  .setDescription('soup service server api documents')
  .setVersion('1.0')
  .addBasicAuth(
    {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      scheme: 'Bearer',
    },
    'Authorization',
  )
  .addServer(process.env.NODE_ENV === 'production' ? '133.186.144.24:3000' : `http://localhost:8080`, 'Inferred Url')
  .build();

export const swaggerDocumentOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};
