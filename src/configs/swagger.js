import swaggerJSDoc from 'swagger-jsdoc';

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dashboard API',
      version: '1.0.0',
      description:
        'Documentação da API com Auth, Transactions, Categories e Summary',
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
