FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app
COPY ./ApiServer .
RUN dotnet publish -o ./output --runtime linux-x64 --self-contained

FROM debian:bullseye-slim AS app-env
RUN apt-get update && apt-get install libicu-dev -y
WORKDIR /app
COPY --from=build-env /app/output .
ENV ASPNETCORE_URLS=http://*:5100
ENTRYPOINT ["./ApiServer"]