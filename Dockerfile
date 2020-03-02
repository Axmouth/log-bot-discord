FROM node:13
COPY --from=intermediate . .
# Define working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
# Copy files and install dependencies
RUN npm install pm2 -g
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install --production
COPY . /usr/src/app

# Set the running environment as production
ENV NODE_ENV production
 
# Expose on specified network port
# EXPOSE 3100 4000
 
# Executing defaults
CMD ["pm2-docker", "start", "process.json"]