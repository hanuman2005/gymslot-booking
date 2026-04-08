FROM node:18-alpine

WORKDIR /app

# Copy package files (this Dockerfile is in /backend folder)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]

# Start app
CMD ["node", "src/server.js"]