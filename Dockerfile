#Build the angular application
FROM node:8
WORKDIR /app
COPY . /app
RUN adduser --disabled-password --gecos "" app
RUN mkdir /npm-global && chown -R app:app /npm-global
RUN chown -R app:app /app && chmod -R 770 /app
USER app
RUN echo "prefix=/npm-global" > ~/.npmrc
RUN npm i -g @angular/cli
ENV PATH="/npm-global/lib/node_modules/@angular/cli/bin:${PATH}"
RUN npm install
USER root
RUN ng build --prod --build-optimizer


#Copy the built files (static HTML, JS, and CSS) into an nginx container
# to serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /usr/share/nginx/html/*
WORKDIR /usr/share/nginx/html
COPY --from=0 /app/dist/* .
EXPOSE 8000
