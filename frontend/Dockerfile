# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN npm ci

COPY . ./

RUN npm run build

# Stage 2: Serve the built application from a lightweight NGINX server
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/api || exit 1

CMD ["nginx", "-g", "daemon off;"]
