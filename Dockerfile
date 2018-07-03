FROM alpine:3.7
MAINTAINER leo.lou@gov.bc.ca

ENV CONTAINER_USER_ID="1001" \
    CONTAINER_GROUP_ID="1001"

RUN apk update \
  && apk add --no-cache --virtual .dev nodejs python make g++ git \
  && git config --global url.https://github.com/.insteadOf git://github.com/
  
RUN adduser -D -u ${CONTAINER_USER_ID} -g ${CONTAINER_GROUP_ID} -h /app -s /bin/sh app \
 && mkdir /npm-global && chown -R app:app /npm-global \
 && chown -R app:app /app && chmod -R 770 /app \
 && mkdir -p /var/www
# configures environment
ENV NPM_CONFIG_PREFIX=/npm-global \
    PATH=$NPM_CONFIG_PREFIX/bin:$PATH \
    CADDY_VER=0.11.0

USER app
ARG configuration
WORKDIR /app
COPY . /app

RUN echo "prefix=/npm-global" > ~/.npmrc \
 && npm i npm@latest -g && npm i -g @angular/cli \
 && npm install
RUN ng build --configuration=${configuration} --prod
 
USER root
# Install Caddy Server, and All Middleware
RUN curl -L "https://github.com/mholt/caddy/releases/download/v$CADDY_VER/caddy_v$CADDY_VER_linux_amd64.tar.gz" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy
    
ADD Caddyfile /etc/Caddyfile
RUN apk del .dev && rm -rf /app /npm-global && cp -r /app/dist/* /var/www/

EXPOSE 8000
CMD ["caddy", "-quic", "--conf", "/etc/Caddyfile"]
