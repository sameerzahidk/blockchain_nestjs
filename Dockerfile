# Stage 1: Build the app
FROM node:18 AS build

# Set working directory
WORKDIR /blockchain/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Nest CLI globally and project dependencies
RUN npm install -g @nestjs/cli \
    && npm install

# Copy the rest of the application code
COPY . .

# Build the Nest.js app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine AS production

# Set working directory
WORKDIR /blockchain/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy build files from the previous stage
COPY --from=build /blockchain/src/app/dist ./dist

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]