# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files & install
COPY package*.json ./
RUN npm ci

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations and start the app
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
