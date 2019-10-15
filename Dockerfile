FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ARG THISAPP
ARG PORT

#RUN node clientCodeBuild.js
RUN sed -e s#http://localhost:8000#${THISAPP}:${PORT}#g public/js/chatHandler.js 
#works if env var set

EXPOSE ${PORT}
CMD node app.js