# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the service port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
