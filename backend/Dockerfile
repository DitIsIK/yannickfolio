FROM node:20.12.1-alpine

WORKDIR /usr/src/app

# Copy package files and install production dependencies.
COPY package*.json ./
RUN npm ci --production

# Copy the rest of the source code.
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
