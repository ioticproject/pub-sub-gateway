FROM node

WORKDIR /var/www/
ADD . /var/www/

RUN npm i
RUN npm run build
CMD node ./dist/main