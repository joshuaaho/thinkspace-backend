FROM node

WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install


# Build TypeScript
RUN npm run build



WORKDIR /app


# Expose port
EXPOSE 8081

# Start the application
CMD ["node", "dist/src/index.js"] 

# https://logs-prod-020.grafana.net
# 1152813:glc_eyJvIjoiMTM3MTYzNiIsIm4iOiJzdGFjay0xMTk1MDE0LWhsLXJlYWQtdGhpbmtzcGFjZSIsImsiOiJWY1UyZzc1dU44b2Y5NjNXbHBqOXV5ODkiLCJtIjp7InIiOiJwcm9kLWFwLXNvdXRoZWFzdC0xIn19