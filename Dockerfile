# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files from repo root
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
