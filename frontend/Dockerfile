# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# API base URL is baked in at build time (docker-compose passes /api)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies (npm ci = exact versions from package-lock.json)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Serve the static build with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
