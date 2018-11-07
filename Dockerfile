ARG GO_DEPENDENCY_LABEL_BASE_NODEJS
FROM eu.gcr.io/at-artefacts/platform-base-nodejs:$GO_DEPENDENCY_LABEL_BASE_NODEJS

COPY --chown=atcloud:atcloud package.json $APP_DIR
RUN npm install
COPY --chown=atcloud:atcloud . $APP_DIR
RUN ./node_modules/.bin/grunt ci

ENV DEBUG=*

CMD ["node", "built/lib/index.js"]
