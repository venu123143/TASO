export const swagOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Thapala API documentation",
            version: '1.0.0',
            description: "This is an trading Community Platform",
        },
        servers: [
            {
                url: process.env.SWAGGER_URL
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { // New security scheme for Bearer token
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [ // Apply security globally to all endpoints
            {
                bearerAuth: [], // Apply Bearer token authentication
            },
        ],
    },
    apis: ["./src/services/**/*.ts"]
}

export default swagOptions;
