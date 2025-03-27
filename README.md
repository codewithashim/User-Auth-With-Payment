# Project Documentation

## Table of Contents

* [Project Overview](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#project-overview)
* [Folder Structure](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#folder-structure)
* [Installation Guide](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#installation-guide)
  * [Using Docker](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#using-docker)
  * [Manual Installation](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#manual-installation)
* [Environment Configuration](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#environment-configuration)
* [API Documentation](https://chatgpt.com/c/67e58b6a-92cc-800b-bc6b-a94d0096b283#api-documentation)

---

## Project Overview

This project is a backend service built with Node.js and TypeScript. It includes authentication, payment processing, user management, and various utility modules. The project follows a modular architecture for scalability and maintainability.

---

## Folder Structure

```
└── 📁backend
    └── 📁.vscode                 # VS Code settings
        └── settings.json
    └── 📁docs                   # Documentation files
    └── 📁logs                   # Log files for application
        └── combined.log
        └── error.log
    └── 📁scripts                # Utility scripts
    └── 📁src                    # Source code
        └── .editorconfig        # Editor configuration
        └── 📁app                # Main application files
        └── app.ts               # Application entry point
            └── 📁modules        # Feature modules
                └── 📁auth        # Authentication module
                    └── auth.controller.ts
                    └── auth.interface.ts
                    └── auth.routes.ts
                    └── auth.service.ts
                    └── auth.swagger.ts
                    └── auth.validation.ts
                └── 📁health      # Health check module
                    └── health.controller.ts
                └── 📁payments    # Payments module
                    └── payments.controller.ts
                    └── payments.interface.ts
                    └── payments.model.ts
                    └── payments.routes.ts
                    └── payments.service.ts
                    └── payments.swagger.ts
                    └── payments.validation.ts
                └── 📁users       # User management module
                    └── users.controller.ts
                    └── users.interface.ts
                    └── users.models.ts
                    └── users.routes.ts
                    └── users.services.ts
                    └── users.swagger.ts
                    └── users.validation.ts
            └── 📁routes          # API routes
                └── index.ts
        └── server.ts             # Server entry point
        └── 📁shared              # Shared utilities and configurations
            └── 📁config          # Configuration files
                └── db-config.ts
                └── env-config.ts
                └── router-config.ts
                └── swagger-config.ts
            └── 📁constants       # Common constants
                └── api-response-message.ts
                └── common-constants.ts
            └── 📁enums           # Enums for project
                └── users-enum.ts
            └── 📁errors          # Error handling modules
                └── api-error.ts
                └── cast-error.ts
                └── global-error.ts
                └── validation-error.ts
                └── zod-error.ts
            └── 📁helpers         # Helper functions
                └── jwt-helper.ts
                └── pagination-helper.ts
            └── 📁middleware      # Middleware functions
                └── auth-middleware.ts
                └── rate-limiter.ts
                └── validation-middleware.ts
            └── 📁services        # Shared services
                └── 📁email
                    └── email.service.ts
            └── 📁types           # Type definitions
                └── common-type.ts
                └── custom-jwt-payload.ts
                └── error-type.ts
                └── express.d.ts
                └── pagination-type.ts
            └── 📁utils           # Utility functions
                └── auth.utils.ts
                └── catch-async.ts
                └── logger.ts
                └── pagination-pick.ts
                └── payment.utils.ts
                └── send-response.ts
                └── swagger.ts
            └── 📁validation      # Input validation
                └── env-validation.ts
        └── 📁tests               # Test files
    └── 📁uploads                # File uploads storage
    └── .dockerignore            # Docker ignore file
    └── .env                     # Environment variables
    └── .env.development         # Development environment variables
    └── .env.example             # Example environment variables
    └── .env.production          # Production environment variables
    └── .eslintignore            # ESLint ignore file
    └── .eslintrc                # ESLint configuration
    └── .gitignore               # Git ignore file
    └── .prettierrc              # Prettier configuration
    └── docker-compose.yml       # Docker Compose configuration
    └── Dockerfile               # Docker build configuration
    └── jest.config.js           # Jest configuration for testing
    └── package-lock.json        # Lock file for dependencies
    └── package.json             # Node.js project metadata
    └── README.md                # Documentation file
    └── tsconfig.json            # TypeScript configuration
```

---

## Installation Guide

### Using Docker

1. **Ensure Docker is installed** on your machine.
2. Copy `.env.example` to `.env` and update configurations.
3. Run the following command to start the application:
   ```sh
   docker-compose up --build
   ```
4. The application should now be running on `http://localhost:8000`.

### Manual Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   * Copy `.env.example` to `.env`
   * Update values accordingly
4. **Start MongoDB** (if using locally):
   ```sh
   mongod --dbpath ./data
   ```
5. **Run the application:**
   ```sh
   npm run dev
   ```
6. The server should now be running on `http://localhost:8000`.

---

## Environment Configuration

Create a `.env` file with the following structure:

```env
#############################################
#              SERVER CONFIG               #
#############################################
PORT=8000  
NODE_ENV=development  

#############################################
#              DATABASE CONFIG             #
#############################################
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<appName>  

#############################################
#               DOMAIN CONFIG              #
#############################################
DOMAIN=http://localhost:8000  

#############################################
#               AUTH CONFIG                #
#############################################
JWT_SECRET=<your_jwt_secret>  
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>  
JWT_EXPIRE=7d  
JWT_REFRESH_EXPIRE=7d  
BCRYPT_SALT_ROUND=10  

#############################################
#               EMAIL CONFIG                #
#############################################
EMAIL_HOST=smtp.example.com  
EMAIL_PORT=587  
EMAIL_SECURE=false  
EMAIL_USER=<your_email>  
EMAIL_PASS=<your_email_password>  
EMAIL_FROM=noreply@yourapp.com  

#############################################
#              AWS CONFIGURATION           #
#############################################
AWS_ACCESS_KEY_ID=<your_aws_access_key>  
AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>  
AWS_REGION=ap-northeast-2  
AWS_BUCKET_NAME=<your_bucket_name>  

#############################################
#              CORS CONFIGURATION          #
#############################################
ALLOW_DOMAINS=http://localhost:8000,http://localhost:3000,http://localhost:5000  

#############################################
#              PAYMENT CONFIGURATION        #
#############################################
PAYPAL_ENV=sandbox  
PAYPAL_CLIENT_ID=<your_paypal_client_id>  
PAYPAL_CLIENT_SECRET=<your_paypal_client_secret>  
PAYPAL_WEBHOOK_ID=  
PAYPAL_URL=https://api.sandbox.paypal.com  

```

---

## API Documentation

* The API documentation is auto-generated using Swagger.
* Once the server is running, visit:
  ```
  http://localhost:8000/api-docs
  ```
* It provides detailed API endpoint information, request/response formats, and authentication methods.

---

This completes the project documentation. 🚀
