FROM turbinelabs/gcloud-build:0.19.0
RUN gcloud components update

# Install nodeJS and NPM
RUN apk update && \
    apk add --update nodejs  && \
    npm install newman --global

WORKDIR /usr/src/app

COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

COPY src .
COPY package.json package.json

RUN npm install
CMD ["./entrypoint.sh"]
