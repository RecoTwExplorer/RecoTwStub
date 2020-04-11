FROM node:13.12.0-alpine AS build
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
ENV PORT 80
COPY --from=build /app /
EXPOSE 80
USER 0
CMD ["dist/server.js"]
