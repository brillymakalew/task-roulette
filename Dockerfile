# Use Node.js 20 Alpine as base image for a smaller footprint
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies specifically
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Ensure a data directory exists for the SQLite database volume point
RUN mkdir -p /app/data

# Expose the port Next.js will be listening on
EXPOSE 3000

# Set required environment variables for run time
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Set Prisma database URL to a persistent path mapped to a host volume
ENV DATABASE_URL="file:/app/data/dev.db"

# The start command pushes the DB schema so SQLite is correctly configured, then starts Next.js
CMD ["sh", "-c", "npx prisma db push && npm run start"]
