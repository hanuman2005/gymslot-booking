ARG BUILD_ID=render-build-1
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/src ./src

EXPOSE 5000
CMD ["node", "src/server.js"]
