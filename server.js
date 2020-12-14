

const Dockerode = require('dockerode');
const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

  var labels = {"traefik.http.routers.jwilderwhoami.rule":"Host(`jwilderwhoami.codenovator.net`)","traefik.http.routers.jwilderwhoami.tls":"true","traefik.http.routers.jwilderwhoami.tls.certresolver":"lets-encrypt","traefik.port":"80"};
  var networkmode= "web";
  var image = "jwilder/whoami";
  var exposedports= {"8000":{}};
  var stoptimeout=10;
  var stopsignal= "SIGTERM";

var host= "codenovator.net";
var fs = require('fs');
var path = require('path');
var http = require('http');
var randomstring = require("randomstring");
var server = http.createServer();
var xtend = require('xtend');
var rnd='xxx';
var subhost='';
var newhost=host;
var html='';

var storageopt= [{"size":"2G"}];

var timeLimit= 60000*60; //15000ms= 15s
const appPort = 8000;
const nocache = require('nocache');
const express = require('express');
const app = express();
app.use(nocache());
//COMMON FUNCTIONS
function destroyContainer(arg) {
    console.log(`arg was => ${arg}`);
    arg.stop(function (err, data) {
        console.log('container stopped',data);
        arg.remove(function (err, data) {
            console.log('container removed',data);
    
        });
    });
    //var kill= child.destroy();
    //console.log(kill);
    //console.log('child id', child.id);
}

function containerInit(labels,res){
    const container =  docker.createContainer({
        AttachStderr: true,
        AttachStdin: true,
        AttachStdout: true,
        ExposedPorts: exposedports,
        StopTimeOut: stoptimeout,
        StopSignal: stopsignal,
        //Cmd: ['tr', '[a-z]', '[A-z]'],
        Image: image,
        OpenStdin: true,
        StdinOnce: true,
        Tty: false,
        //StorageOpt: storageopt,
        Memory: 4294967296 , //4G
        Labels: labels,
        NetworkMode: networkmode
      }, function(err, container){
            console.log(err);
            var c = docker.getContainer(container.id);
            c.start(function (err, data) {
                setTimeout(destroyContainer, timeLimit, c);

                containerSpawned(data,res);
            });
      });
}

function containerSpawned(arg,res) {
    console.log(`spawned`, arg);
    //setTimeout(destroyContainer, timeLimit, arg);
    res.writeHead(301,{Location: 'https://'+newhost});
    res.end(); 
}

function containerExited(arg) {
    //console.log(`destroyed`, child.id);
}  
//END COMMON FUNCTIONS

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
            console.log("launching image container",image)
            
    
            subhost=randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
            });

            newhost=subhost.concat('.').concat(host);
 
            labels= '{"traefik.http.routers.'+ subhost + '.rule":"Host(`'+ subhost+'.codenovator.net`)",';
            labels= labels + '"traefik.http.routers.'+ subhost + '.tls":"true",'; 
            labels= labels + '"traefik.http.routers.'+ subhost + '.tls.certresolver":"lets-encrypt",';
            labels= labels + '"traefik.port":"80",';
            labels= labels + '"image.type":' + '"' + subhost + '"' + '}';
            labels= JSON.parse(labels);

            containerInit(labels,res);
    
    })
    
    /*server.on('listening', function() {
      console.log('Open http://localhost:'+server.address().port+'/ in your browser')
    })*/
    
    //server.listen(serverPort)
    app.listen(appPort, () => console.log(`Example app listening on port ${appPort}!`))