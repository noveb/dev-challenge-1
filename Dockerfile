FROM node:18-alpine as base
WORKDIR /app
RUN chown -R node:node ./

FROM base as dev-dependencies
RUN wget -O /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENV NODE_ENV=development
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

FROM base as prod-dependencies
RUN wget -O /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENV NODE_ENV=production
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM dev-dependencies as builder
COPY --from=dev-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node src ./src
COPY --chown=node:node tsconfig.json ./
ENV NODE_ENV=development
RUN npm run build

FROM base as production
RUN apk add --no-cache tini
COPY --from=prod-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=prod-dependencies /wait-for-it.sh /wait-for-it.sh
COPY --from=builder --chown=node:node /app/dist ./
ENV NODE_ENV=production
ENV PORT=5000
USER node
CMD [ "node", "index.js" ]
ENTRYPOINT ["/sbin/tini", "--"]
HEALTHCHECK --interval=10s --timeout=1s CMD node ./bin/healthCheck.js

FROM base as local
RUN apk add --no-cache tini git
ENV GIT_WORK_TREE=/app/ GIT_DIR=/app/.git
COPY --from=dev-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=dev-dependencies /wait-for-it.sh /wait-for-it.sh
COPY --chown=node:node src ./src
USER node
CMD [ "npm", "run", "debug:docker" ]
ENTRYPOINT ["/sbin/tini", "--"]
HEALTHCHECK --interval=300s --timeout=1s CMD node ./src/bin/healthCheck.js