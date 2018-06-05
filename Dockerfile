FROM node:8

ENV BUILD_DIR /opt
WORKDIR ${BUILD_DIR}
RUN adduser --disabled-password --gecos "" app
RUN chown -R app:0 ${BUILD_DIR} && chmod -R 770 ${BUILD_DIR} \
 && chown -R app:app /home/app && chmod -R 770 /home/app
USER app

RUN mkdir ${BUILD_DIR}/.npm-global
ENV PATH=${BUILD_DIR}/.npm-global/bin:$PATH \
 NPM_CONFIG_PREFIX=${BUILD_DIR}/.npm-global

COPY . ${BUILD_DIR}


RUN \
 npm install -g @angular/cli \
 && cd apireg/apireg \
 && npm install \
 && ng build --base-href ${ContextPath}

EXPOSE 8080


#copy the built files into an nginx container.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=0 /app/dist/ .
EXPOSE 8000