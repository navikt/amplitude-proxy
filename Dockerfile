FROM node:alpine
WORKDIR /app
COPY . .
RUN yarn install --ignore-optional --ignore-scripts --no-progress --production
ENV PORT=4242
EXPOSE 4242
RUN chmod +x ./*.sh
USER node
CMD ./serve.sh
