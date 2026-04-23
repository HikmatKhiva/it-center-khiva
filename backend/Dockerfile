FROM node:22-alpine3.20

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
CMD [ "npm", "run", "server","&&", "npx", "prisma", "migrate", "deploy" ]
# CMD npx prisma migrate deploy && npm run server