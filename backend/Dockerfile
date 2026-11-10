FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies first for Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code (owned by the unprivileged "node" user)
COPY --chown=node:node . .

# Do not run the API as root
USER node

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
