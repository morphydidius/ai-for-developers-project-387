FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY backend/ ./backend/
COPY frontend/ ./frontend/

RUN cd frontend && npm run build

EXPOSE $PORT

CMD ["node", "backend/server.js"]
