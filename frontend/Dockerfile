FROM node AS build-env
WORKDIR /src
COPY . .
RUN corepack enable
RUN pnpm install
RUN pnpm build --outDir ./output
RUN rm ./output/config.json

FROM nginx as app-env
RUN rm /etc/nginx/conf.d/default.conf  
WORKDIR /app
COPY --from=build-env /src/nginx.conf /etc/nginx/conf.d
COPY --from=build-env /src/output /app
ENV NGINX_PORT=3000
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]