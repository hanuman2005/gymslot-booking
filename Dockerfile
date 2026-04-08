# Build 5:48 PM - fix Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files (Railway context is /backend, so no prefix needed)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Verify files exist
RUN ls -la /app/src/server.js

EXPOSE 5000

CMD ["node", "src/server.js"]
