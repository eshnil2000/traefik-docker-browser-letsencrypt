#docker build -t labs .
#docker run -d -v /var/run/docker.sock:/var/run/docker.sock  --privileged labs

FROM node:latest
RUN apt update && apt install nano
WORKDIR /usr/src/app
RUN npm install --save-dev dockerode
#RUN npm install --save-dev docker-compose composefile

RUN apt-get update && \
apt-get -y install apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common && \
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable" && \
apt-get update && \
apt-get -y install docker-ce docker-compose

RUN npm install --save-dev randomstring xtend nocache express

COPY *.sh /usr/src/app/
RUN chmod +x /usr/src/app/start.sh

WORKDIR /usr/src/app
COPY *.js /usr/src/app/

EXPOSE 8000
CMD /usr/src/app/start.sh
#RUN service docker start
