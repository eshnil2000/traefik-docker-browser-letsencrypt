//const composefile = require('composefile');
//const dockercompose = require('docker-compose');
const path = require('path');
var Docker = require('dockerode');


//var docker = new Docker({socketPath: '/var/run/docker.sock'});
var servicename="jwilderwhoami" ;


options = '{'+
  '"outputFolder":'+ '"'+ __dirname + '"'+ ','+
  '"filename": "docker-compose.yml",' +
  //'"networks": {"default":{"external":{"name":"web"}}} ,' +
  '"services": {'  +
    '"'+servicename+ '"' +': {' +
        '"image": "jwilder/whoami",'+
        '"ports": ["8000"],'+
        //'"networks": ["web"]'+
        '"networks": {"default":{"external":{"name":"web"}}} '+
      '}'+
      
      //'"labels": ["traefik.http.routers.jwilderwhoami.rule:Host(`jwilderwhoami.codenovator.net`)","traefik.http.routers.jwilderwhoami.tls:true","traefik.http.routers.jwilderwhoami.tls.certresolver:lets-encrypt","traefik.port:80"]'+

      '}'+'}';

options= JSON.parse(options);
console.log(options);

//composefile(options, err => { console.log('done'); });

/*dockercompose.upAll({ cwd: path.join(__dirname), log: true })
  .then(
    () => { console.log('done')},
    err => { console.log('something went wrong:', err.message)}
  ); */

var name="jwilder";
var publishedPorts = 8000;
var image= "jwilder/whoami";
var network = "web";
var labels = ["traefik.http.routers.jwilderwhoami.rule=Host(`jwilderwhoami.codenovator.net`)","traefik.http.routers.jwilderwhoami.tls=true","traefik.http.routers.jwilderwhoami.tls.certresolver=lets-encrypt","traefik.port=80"];
var exposedport = 8000;
var endpointspec = {"Ports": [{"PublishedPort":publishedPorts}]};
var tasktemplate=  {"ContainerSpec": {"Image": "jwilder/whoami"}};

var docker = new Docker({ Name: name, ExposedPorts: exposedPorts, Image:image,NetworkMode: network, Labels:labels });
