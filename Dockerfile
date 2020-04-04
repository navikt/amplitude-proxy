FROM node:alpine
WORKDIR /app
COPY . .
RUN find . -name "*.spec.js" -type f -delete && \
    npm install --ignore-optional --ignore-scripts --no-progress --production && \
    chmod +x ./*.sh
CMD ./serve.sh
