/*
 * To keep this code short I am not dealing with error handling, security details, etc.
 https://technology.amis.nl/2018/04/19/remote-and-programmatic-manipulation-of-docker-containers-from-a-node-application-using-dockerode/

 */

const Dockerode = require('dockerode');

module.exports = async (stdin) => {
  const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });
  var labels = {"traefik.http.routers.jwilderwhoami.rule":"Host(`jwilderwhoami.codenovator.net`)","traefik.http.routers.jwilderwhoami.tls":"true","traefik.http.routers.jwilderwhoami.tls.certresolver":"lets-encrypt","traefik.port":"80"};
  var networkmode= "web";
  var image = "jwilder/whoami";
  var exposedports= {"8000":{}};
  var stoptimeout=10;
  var stopsignal= "SIGTERM";
  // Create the container.
  const container = await docker.createContainer({
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
    Labels: labels,
    NetworkMode: networkmode
  });
  
  // Attach the container.
  /*const stream = await container.attach({
    hijack: true,
    stderr: true,
    stdin: true,
    stdout: true,
    stream: true,
  });*/

  // Promisify stream callback response to be able to return its value.
  /*const stdout = new Promise((resolve) => {
    stream.on('data', (data) => {
      // The first 8 bytes are used to define the response header.
      // Please refer to https://docs.docker.com/engine/api/v1.37/#operation/ContainerAttach
      const response = data && data.slice(8).toString();
    
      resolve(response);
    });
  });

  stream.write(stdin); */
  
  // Start the container.
  await container.start();

  // We need this and the hijack flag so we can signal the end of the stdin input for the container
  // while still being able to receive the stdout response.
 /* stream.end(); */
  
  // We wait for container response.
  /*await container.wait(); */
  
  // We remove the container after its execution. This is the same as `--rm`.
  //container.remove();
  var stdout= "DONE";
  return stdout;
};