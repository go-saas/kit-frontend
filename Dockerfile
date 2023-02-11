FROM node:16.15.0 AS build
ARG INITIAL_QIANKUN_MASTER_OPTIONS
ENV INITIAL_QIANKUN_MASTER_OPTIONS $INITIAL_QIANKUN_MASTER_OPTIONS
ARG EXTRA_ROUTES
ENV EXTRA_ROUTES $EXTRA_ROUTES
WORKDIR /usr/app

RUN npm install -g pnpm@7.9.0


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
