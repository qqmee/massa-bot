#####################
## Stages
## 1) Install dependencies
## 2) Distroless production image
#####################

# 1. Install dependencies
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build && npm prune --production

## 2. Production build
FROM gcr.io/distroless/nodejs20-debian11:nonroot

WORKDIR /app

ENV NODE_ENV="production"

COPY --from=build /app/node_modules /app/node_modules
COPY ./data /app/data
COPY ./locales /app/locales
COPY --from=build /app/dist /app/dist

CMD ["dist/main.js"]
