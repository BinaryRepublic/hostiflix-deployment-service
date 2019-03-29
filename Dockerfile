FROM turbinelabs/gcloud-build:latest

WORKDIR /usr/src/app
COPY /api /usr/src/app
# Install nodeJS and NPM
RUN apk update && \
    apk add --update nodejs  && \
    npm install newman --global

RUN npm install
RUN gcloud components update
EXPOSE 3003

CMD ["./build.sh"]