FROM node:13.6.0-alpine
EXPOSE 3000
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json .
RUN npm install --silent
CMD ["npm", "start"]