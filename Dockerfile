# Use Node.js official image
FROM node:18-alpine

WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY backend/src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
