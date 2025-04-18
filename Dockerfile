
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM arm64v8/node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]

#Healthcheck
HEALTHCHECK --interval=5m --timeout=3s \
  CMD wget --quiet --spider http://localhost:3000/ || exit 1
