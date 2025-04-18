FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM arm64v8/node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
# Check if public directory exists before copying
RUN if [ -d "/app/public" ]; then cp -r --from=builder /app/public ./public; fi
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]