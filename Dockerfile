FROM node:8-slim

RUN apt-get update && apt-get install -yV \
  net-tools \
  curl \
  dnsutils \
  build-essential


ENV PORT 8080
ARG NPM_TOKEN

# npm install
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

WORKDIR /data

RUN mkdir kong corp_nginx pci_nginx edge_nginx && chmod 755 kong corp_nginx pci_nginx edge_nginx


RUN mkdir -p /opt/app-root/ && cp -a /tmp/node_modules /opt/app-root/

# prepare app
WORKDIR /opt/app-root/
COPY . .

RUN chmod -R 775 .

RUN curl https://github.com/openshift/origin/releases/download/v3.6.1/openshift-origin-client-tools-v3.6.1-008f2d5-linux-64bit.tar.gz -OL
RUN tar -xvf openshift-origin-client-tools-v3.6.1-008f2d5-linux-64bit.tar.gz
RUN export PATH=$PATH:openshift-origin-client-tools-v3.6.1-008f2d5-linux-64bit

EXPOSE 8080

CMD npm start