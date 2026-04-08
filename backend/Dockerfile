FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy all application files (models, controllers, routes, db, middleware, server.js)
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

# Start app
CMD ["node", "src/server.js"]