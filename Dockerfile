# base
FROM node:22-alpine AS base

# deps
FROM base AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run building

# runner
FROM base AS runner
WORKDIR /app

COPY --from=builder /app /

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]
