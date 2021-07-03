# Use an image with a preinstalled
# NodeJS runtime
FROM node
# create and switch
# to the /var/www directory
WORKDIR /var/www/
# copy the current source files
# to the /var/www directory
ADD . /var/www/
# install project dependencies
RUN npm i
# create a project build
RUN npm run build
# run the project
CMD node ./dist/main