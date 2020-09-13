FROM node:14.10.1-alpine AS build
ENV PORT 8080
WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies \
        git && \
    npm install && \
    npm run build && \
    npm prune --production && \
    apk del --no-cache build-dependencies && \
    rm -rf \
        /app/src \
        /root/.npm \
        /usr/local/share/.cache \
        /tmp/*

FROM astefanutti/scratch-node
COPY --from=build /app /
CMD ["dist/server.js"]
