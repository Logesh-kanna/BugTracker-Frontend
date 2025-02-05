FROM node:16 AS build
WORKDIR /bugtracker-frontend-app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /bugtracker-frontend-app/dist/front-end /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
