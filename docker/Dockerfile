FROM node:latest as nodebuilder

ENV PORT="${PORT}"
ENV SCRIPTS_PATH="${SCRIPTS_PATH}"

# LABEL stage=nodebuilder

# VOLUME [ "/storage" ]

WORKDIR /app

COPY . ./

EXPOSE ${PORT}

RUN npm cache clear --force
RUN npm install

CMD ["node", "server.js"]
