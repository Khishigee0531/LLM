# Use minimal Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and tsconfig.json first to install dependencies
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run the built app
CMD ["node", "dist/index.js"]
