FROM node:4

ENV APP_NAME Translator

WORKDIR /usr/app

# cache packages in the layer
COPY package.json .
RUN npm install

# copy all app code
COPY . .

#fire up the app
CMD ["node", "index.js"]; 