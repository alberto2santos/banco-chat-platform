const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Comunicação Bancária',
            version: '1.0.0',
            description: 'API RESTful com WebSocket para chat em tempo real entre clientes e gerentes bancários',
            contact: {
                name: 'Equipe de TI',
                email: 'ti@banco.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            },
            {
                url: 'https://api.banco.com',
                description: 'Servidor de produção'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido no endpoint /api/auth/login'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
        customSiteTitle: 'API Docs - Comunicação Bancária',
        customCss: '.swagger-ui .topbar { display: none }'
    }));
    
    console.log('📚 Documentação Swagger disponível em: http://localhost:3000/api-docs');
};