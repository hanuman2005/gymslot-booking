FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Expose the port Railway provides
EXPOSE 5000

# Start the app
CMD ["node", "src/server.js"]