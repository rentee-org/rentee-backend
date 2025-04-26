# Use Node LTS as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy remaining files
COPY . .

# Expose app port (change if needed)
EXPOSE 3000

# Start the app
CMD ["yarn", "start:prod"]
