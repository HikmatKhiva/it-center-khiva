FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm install -g vite 
RUN npm install 

COPY . .

EXPOSE 3000
# Build the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]