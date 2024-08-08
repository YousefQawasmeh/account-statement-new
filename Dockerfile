# Dockerfile

# build environment
FROM node:18.17.0-alpine AS build
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

# runtime environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html/account-statement-new
COPY --from=build /app/nginx/ /etc/nginx/conf.d/
