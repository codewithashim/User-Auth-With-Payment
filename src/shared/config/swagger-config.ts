import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger configuration options for the Construction CRM API.
 *
 * This configuration defines the OpenAPI specification for the API, including
 * metadata, server information, security schemes, and the paths to the API
 * documentation files.
 *
 * @constant
 * @type {swaggerJsdoc.Options}
 *
 * @property {object} definition - The OpenAPI specification definition.
 * @property {string} definition.openapi - The OpenAPI version.
 * @property {object} definition.info - Metadata about the API.
 * @property {string} definition.info.title - The title of the API.
 * @property {string} definition.info.version - The version of the API.
 * @property {string} definition.info.description - A brief description of the API.
 * @property {object} definition.info.license - The license information for the API.
 * @property {string} definition.info.license.name - The name of the license.
 * @property {string} definition.info.license.url - The URL to the license.
 * @property {object} definition.info.contact - Contact information for the API maintainer.
 * @property {string} definition.info.contact.name - The name of the contact person.
 * @property {string} definition.info.contact.url - The URL to the contact person's website.
 * @property {string} definition.info.contact.email - The email address of the contact person.
 * @property {Array<object>} definition.servers - The list of servers where the API is hosted.
 * @property {object} definition.components - The components used in the API.
 * @property {object} definition.components.securitySchemes - The security schemes for the API.
 * @property {object} definition.components.securitySchemes.bearerAuth - The bearer authentication scheme.
 * @property {string} definition.components.securitySchemes.bearerAuth.type - The type of the security scheme.
 * @property {string} definition.components.securitySchemes.bearerAuth.scheme - The scheme name.
 * @property {string} definition.components.securitySchemes.bearerAuth.bearerFormat - The format of the bearer token.
 * @property {Array<object>} definition.security - The security requirements for the API.
 * @property {Array<string>} apis - The paths to the API documentation files.
 */

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth & Payment API',
            version: '1.0.0',
            description: 'API documentation for Auth & Payment',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Ashim Rudra Paul',
                url: 'https://codewithashim.vercel.app/',
                email: 'codewithashim@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8000/api/v1',
                description: 'Development server',
            },
            {
                url: 'https://api.your-production-domain.com',
                description: 'Production server',
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
        security: [{ bearerAuth: [] }],
    },
    apis: [
        './src/app/modules/**/*.routes.ts',
        './src/app/modules/**/*.swagger.ts',
    ],
};

export default swaggerJsdoc(options);
