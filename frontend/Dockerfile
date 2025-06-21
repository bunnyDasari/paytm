FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (for Docker cache efficiency)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Vite default dev port
EXPOSE 5173

# Add --host to allow external access (important!)
CMD ["npm", "run", "dev"]




