# Build 5:25 PM
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - fail if npm install fails
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Verify files exist
RUN ls -la /app/src/server.js

EXPOSE 5000

CMD ["node", "src/server.js"]
