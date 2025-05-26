FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install 

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate 
# RUN npx prisma init --output ../generated/prisma
# RUN npm install -g nodemon

COPY . .
EXPOSE 5000
# Build the app
CMD [ "npm", "run", "server" ]