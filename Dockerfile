# Use an image that includes both Python and Node.js
FROM nikolaik/python-nodejs:python3.9-nodejs16

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Build the application
RUN npm run build

# Expose port 5000 (internal container port)
EXPOSE 5000

# The CMD is now handled by docker-compose.yml
