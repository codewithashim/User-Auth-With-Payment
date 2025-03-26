# Base Image for Node.js
FROM node:22 AS base

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Install type definitions and development dependencies (for development stage)
RUN npm install --save-dev @types/express @types/cors

# Copy the rest of the app's source code
COPY . .

# Development Stage
FROM base AS development

# Install development dependencies
RUN npm install --only=development

# Set environment variables (for development)
ENV NODE_ENV=development
ENV PORT=8000

# Expose the development port
EXPOSE 8000

# Use the development .env file
COPY .env.development .env

# Start the app in development mode (use ts-node-dev for fast dev)
CMD ["npm", "run", "dev"]
 