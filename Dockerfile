# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm i --omit=dev

# Copy built application from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]