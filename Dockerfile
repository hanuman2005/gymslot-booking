# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files (Railway root is /backend, so just use . for /backend/)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
