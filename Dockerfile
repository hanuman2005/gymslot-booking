# Build 5:25 PM
FROM node:18-alpine

WORKDIR /app

# Copy package files from backend (Railway root is /backend)
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code from backend
COPY backend/src ./src

# Verify files exist
RUN ls -la /app/src/server.js

EXPOSE 5000

CMD ["node", "src/server.js"]
