# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./

# Install Quasar CLI globally
RUN npm install -g @quasar/cli
RUN npm install

COPY . .

# Use Quasar CLI to build the project
RUN quasar build -m pwa

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html

# (Optional) Copy a simplified NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
