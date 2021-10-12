FROM node:alpine
WORKDIR /app
RUN npm install -g npm
COPY . .
RUN find . -name "*.spec.js" -type f -delete && \
    chmod +x ./*.sh
CMD ./serve.sh
