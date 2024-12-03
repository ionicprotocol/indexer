# Use a more compatible image for cross-platform support
FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on


# Expose ports
EXPOSE 3000

# Run the application
CMD ["npm", "run", "ponder"]
