FROM turbinelabs/gcloud-build:latest

# Install PYTHON3
RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
    rm -r /root/.cache

RUN apk add --no-cache git

# Install nodeJS and NPM
RUN apk update && \
    apk add --update nodejs  && \
    npm install newman --global



RUN mkdir ~/.ssh

RUN apk add --no-cache openssh-client
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts