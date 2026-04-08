# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend source code
COPY backend/src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
