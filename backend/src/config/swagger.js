import swaggerJSDOC from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Beatz API",
            version: "1.0.0",
            description: "Documentação da API do Beatz",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')], 
}

const swaggerSpec = swaggerJSDOC(options);
export default swaggerSpec;