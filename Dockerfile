# Use Node.js official image
FROM node:18-alpine
# Force rebuild - 5:14 PM
# Set working directory
WORKDIR /app

# Copy package files (Railway root is /backend)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY backend/src ./src
# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
