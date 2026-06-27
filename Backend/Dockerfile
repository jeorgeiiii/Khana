# Backend/Dockerfile

# 1. Start from a small official Node image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only package files first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --omit=dev

# 5. Copy the rest of your source code
COPY . .

# 6. Tell Docker which port your app listens on (you use 5000)
EXPOSE 5000

# 7. The command that starts your app
CMD ["node", "index.js"]