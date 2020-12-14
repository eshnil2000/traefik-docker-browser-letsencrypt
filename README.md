# traefik-docker-browser-letsencrypt

### Use in conjunction with
* https://github.com/eshnil2000/traefik-letsencrypt-docker

### Build container, 
* #docker build -t labs .
* docker-compose up -d
* check traefik dashboard for domain
* add/modify domains/ containers in server.js as required

```node
app.get('/:id', (req, res) =>{
    //server.on('request', function(req, res) {
            if (req.params.id==1){
                image= "jwilder/whoami";
                exposedports= {"8000":{}};
            }
            if(req.params.id==2){
                image= "eshnil2000/docker-ubuntu-vnc-pygame-wingide";
                exposedports= {"80":{}};
                //storageopt= [{"size":"5G"}];

            } 
```
