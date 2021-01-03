

const Dockerode = require('dockerode');
const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

  var labels = {"traefik.http.routers.jwilderwhoami.rule":"Host(`jwilderwhoami.codenovator.net`)","traefik.http.routers.jwilderwhoami.tls":"true","traefik.http.routers.jwilderwhoami.tls.certresolver":"lets-encrypt","traefik.port":"80"};
  var networkmode= "traefik_default";
  var image = "jwilder/whoami";
  var exposedports= {"8000":{}};
  var loadbalancerport =8000;
  var stoptimeout=10;
  var stopsignal= "SIGTERM";

//var host= "localhost";
var host= "labs.dappsuni.com";
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var randomstring = require("randomstring");
var server = http.createServer();
var xtend = require('xtend');
var rnd='xxx';
var subhost='';
var newhost=host;
var html='';
var newurl='';
var urlreturncode=';'
var storageopt= [{"size":"2G"}];

var timeLimit= 60000*10; //60,000ms= 60s
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
    function makeRequest() {
        newurl= 'https://'+newhost;
        https.get(newurl, function(res) {
            return res.statusCode;
        })
     }
     
    function myFunction() {
        //urlreturncode= makeRequest();
        //console.log("urlcode is", urlreturncode);
        //if (urlreturncode == 200) {
             //res.write('<a href="https://'+ newhost + '"' +  ' target="_blank" style="appearance:button">Go to Lab</a>');
             //res.write('<iframe src="https://'+ newhost + '"' + 'height="600" width="800" title="Lab"></iframe>');
             res.writeHead(301,{Location: 'https://'+newhost});
             //res.writeHead(301,{Location: 'https://'+newhost});
            res.end();    
        //}
        /*else {
            console.log("setting timeout");
            setTimeout(myFunction, 1000);
        }*/
    }
    
    setTimeout(myFunction,5000);
    
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
                loadbalancerport=8000;
            }
            if(req.params.id==2){
                image= "eshnil2000/docker-ubuntu-vnc-pygame-wingide";
                exposedports= {"80":{}};
                loadbalancerport=80;
                //storageopt= [{"size":"5G"}];

            } 
            if(req.params.id==3){
                image= "eshnil2000/crypto-trading";
                exposedports= {"5000":{}};
                loadbalancerport=5000;
                //storageopt= [{"size":"5G"}];

            }
            console.log("launching image container",image);
            
    
            subhost=randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
            });

            newhost=subhost.concat('.').concat(host);
            //newhost= host.concat('/').concat(subhost);
 
            labels= '{"traefik.http.routers.'+ subhost + '.rule":"Host(`'+ subhost+ "."+ host+'`)",';
            labels= labels + '"traefik.http.routers.'+ subhost + '-secure' + '.rule":"Host(`'+ subhost+ "."+ host+'`)",';
            labels= labels + '"traefik.http.routers.'+  subhost +'-secure' + '.tls":"true",'; 
            labels= labels + '"traefik.http.routers.'+ subhost+ '.entrypoints": "web"'+ ',';
            labels= labels + '"traefik.http.routers.'+ subhost+ '-secure' +'.entrypoints": "websecure"'+ ',';
            labels= labels + '"traefik.http.routers.'+ subhost+ '.service":' + '"'+ subhost +'"'+ ',';
            labels= labels + '"traefik.http.routers.'+ subhost+ '-secure' +'.service":' + '"'+ subhost +'"'+ ',';
            labels= labels + '"traefik.docker.network":"'+  networkmode+ '",';
            labels= labels + '"traefik.enable":"true",';
            labels= labels + '"traefik.http.services.'+ subhost+ '.loadbalancer.server.port":' + '"'+ loadbalancerport+ '"'  + '}';

            console.log(labels);

            labels= JSON.parse(labels);

            containerInit(labels,res);
    
    })
    
    /*server.on('listening', function() {
      console.log('Open http://localhost:'+server.address().port+'/ in your browser')
    })*/
    
    //server.listen(serverPort)
    app.listen(appPort, () => console.log(`Example app listening on port ${appPort}!`))