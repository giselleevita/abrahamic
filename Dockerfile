FROM node:24-bookworm-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/abrahamic
ENV DIRECT_URL=postgresql://postgres:postgres@postgres:5432/abrahamic

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["bash", "scripts/docker-start.sh"]
