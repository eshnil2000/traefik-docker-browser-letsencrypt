# traefik-docker-browser-letsencrypt
### NOTE: LF will be replaced by CRLF when uploading to github from Windows based git system. May need to manually change, Mainly expect issues in shell scripts 
### On windows, cloned linux files get an extra "\r" added at the end. To avoid, use:
```sh
git clone https://github.com/eshnil2000/traefik-docker-browser-letsencrypt.git --config core.autocrlf=input
```
### to launch service manually
```sh
docker service create --network docker-browser2_default \
--name whoami2 --container-label traefik.http.routers.whoami2.rule='Host(`whoami2.localhost`)' \
--container-label traefik.http.routers.whoami2.service="whoami2" \
--container-label traefik.http.services.whoami2.loadbalancer.server.port="8000" \
--container-label traefik.docker.network="docker-browser2_default" \
--label traefik.http.routers.whoami2.rule='Host(`whoami2.localhost`)' \
--label traefik.http.routers.whoami2.service="whoami2" \
--label traefik.http.services.whoami2.loadbalancer.server.port="8000" \
--label traefik.docker.network="docker-browser2_default" jwilder/whoami
```

### Steps
* docker network create -d overlay --attachable docker-browser2_default
* git clone https://github.com/eshnil2000/traefik-docker-browser-letsencrypt.git --config core.autocrlf=input
* cd traefik-docker-browser-letsencrypt
* docker build -t labs .
* docker pull eshnil2000/crypto-trading
* docker pull traefik:v2.3
* docker swarm init
* docker stack deploy -c docker-compose.yml traefik
* check traefik dashboard for domain: localhost:8080
* start labs: localhost/1 or localhost/2 or localhost/3
* add/modify domains/ containers in server.js as required
* to run on localhost, modify labs.dappsuni.com to localhost in all files
* labs timelimited, change var timeLimit= 60000*10; //60,000ms= 60s
* To add new containers, modify the container image and port numbers

```node
app.get('/:id', (req, res) =>{
    //server.on('request', function(req, res) {
            if (req.params.id==1){
                image= "jwilder/whoami";
                exposedports= {"8000":{}};
                loadbalancerport=8000;
            }
```

