# development
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
# production
# FROM node:20-alpine as build
# WORKDIR /usr/src/app
# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm ci

# # Copy application code
# COPY dist ./dist

# # Build the application
# RUN npm run build

# Production stage
# FROM nginx:alpine

# Copy the build output
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# FROM nginx:alpine

# COPY dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
