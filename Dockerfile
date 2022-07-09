FROM node:16.15.0 AS build

WORKDIR /usr/app

RUN npm install -g pnpm@7.4.1


COPY .npmrc ./
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install --prefer-offline
RUN pnpm run -r build
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /usr/app/dist/ /usr/share/nginx/html/
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 8080
