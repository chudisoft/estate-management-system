export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Estate Management API',
      version: '1.0.0',
      description: 'API documentation for Estate Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };
  
  export const options = {
    swaggerDefinition,
    apis: ['./app/api/v1/**/*.tsx'], // Update this to match your TypeScript files
  };
  