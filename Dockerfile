# Use alpine image for ligther images
FROM node:21-alpine3.15

WORKDIR /app

# Copy our package files as usual
# pnp use pnpm-lock.json rather than package-lock.json
COPY package*.json pnpm-lock.yaml /app

# Install dependencies with pnpm and cache mount
RUN --mount=type=cache,id=pnmcache,target=/pnpm_store \
  pnpm config set store-dir /pnpm_store && \
  pnpm config set package-import-method copy && \
  pnpm install --prefer-offline --ignore-scripts --frozen-lockfile

# Copy remaining files
COPY . /app

# Set ENTRYPOINT and/or CMD
ENTRYPOINT ["node", "src/app.js"]