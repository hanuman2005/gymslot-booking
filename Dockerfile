# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy entire backend directory
COPY backend/ ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]
