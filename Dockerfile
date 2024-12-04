FROM node:18.17.1

WORKDIR /app

# Copy package files
COPY package*.json ./

COPY .env .
COPY .env .env
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Set environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports
EXPOSE 3000 3001 42069

# Run the application with necessary flags
CMD ["node", \
     "--experimental-fetch", \
     "--loader", "ts-node/esm", \
     "--no-warnings", \
     "node_modules/.bin/ponder", \
     "dev"]

