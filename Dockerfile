FROM alpine:3.7
MAINTAINER leo.lou@gov.bc.ca

# prepare NodeJS build env
ENV CADDY_VER=0.11.0 \
    CONTAINER_USER_ID="1001" \
    CONTAINER_GROUP_ID="1001"

RUN apk update \
  && apk add --no-cache --virtual .dev curl nodejs python make g++ git \
  && git config --global url.https://github.com/.insteadOf git://github.com/ \
  && adduser -D -u ${CONTAINER_USER_ID} -g ${CONTAINER_GROUP_ID} -h /app -s /bin/sh app \
  && mkdir /npm-global && chown -R app:app /npm-global \
  && chown -R app:app /app && chmod -R 770 /app \
  && mkdir -p /var/www

# installation
USER app
ARG configuration
ENV NPM_CONFIG_PREFIX=/npm-global \
    PATH=$NPM_CONFIG_PREFIX/bin:$NPM_CONFIG_PREFIX/lib/node_modules/@angular/cli/bin:$PATH
    
WORKDIR /app
COPY . /app

RUN echo "prefix=/npm-global" > ~/.npmrc \
 && npm i npm@latest -g && npm i -g @angular/cli \
 && npm install \
 && ng build --configuration=${configuration} --prod
# end of NodeJS build env

# prepare hosting and build env cleanup
USER root
ADD Caddyfile /etc/Caddyfile
RUN curl -L "https://github.com/mholt/caddy/releases/download/v$CADDY_VER/caddy_v$CADDY_VER_linux_amd64.tar.gz" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy \
 && apk del .dev && rm -rf /app /npm-global && cp -r /app/dist/* /var/www/

EXPOSE 8000
CMD ["caddy", "-quic", "--conf", "/etc/Caddyfile"]
