FROM node:18-alpine

WORKDIR /app

# Copy backend package.json
COPY backend/package*.json ./

RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]