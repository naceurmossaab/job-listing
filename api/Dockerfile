# ===== Builder Stage =====
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app (including TypeORM config and migrations)
RUN npm run build


# ===== Production Stage =====
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set environment
ENV NODE_ENV=production

# Expose app port
EXPOSE 3000

# Healthcheck (adjust path if needed)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget --spider -q http://localhost:3000/health || exit 1

# Run migrations using built data-source.js and start app
CMD ["sh", "-c", "node dist/data-source.js migration:run && node dist/main"]
