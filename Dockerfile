FROM node:alpine
WORKDIR /app
COPY . .
RUN find . -name "*.spec.js" -type f -delete && \
    chmod +x ./*.sh
CMD ./serve.sh
