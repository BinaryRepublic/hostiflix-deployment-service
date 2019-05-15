FROM node:alpine
ARG STARTCODE
ARG TOKEN
ARG GIT
ARG BRANCH
ARG BUILDCODE
WORKDIR /usr/src/app

RUN echo '#!/bin/sh' >> run.sh
RUN echo ${STARTCODE} >> run.sh
RUN chmod +x run.sh
RUN apk add --no-cache git
RUN git init
RUN git pull https://${TOKEN}@${GIT} ${BRANCH}
RUN npm install
RUN ${BUILDCODE}
CMD ["./run.sh"]
