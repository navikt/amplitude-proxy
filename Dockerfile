FROM node:16.13.0-alpine3.14
WORKDIR /app
COPY package.* serve.* ./
COPY public public/
COPY src src/
COPY cache cache/
COPY node_modules node_modules/
RUN find . -name "*.spec.js" -type f -delete && \
    chmod +x ./*.sh
CMD ./serve.sh
