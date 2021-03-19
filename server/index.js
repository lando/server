const grpc = require('grpc');
const health = require('grpc-health-check');

const services = [];
services.push(require('./grpc/lando-svc'));

const server = () => {
  const address = process.env['LANDO_ADDR'];
  const server = new grpc.Server();
  const healthStatusMap = {};
  services.forEach(svc => {
    server.addService(svc.definition, svc.implementation);
    // Add health check if available
    if (svc.healthCheck) {
      healthStatusMap[svc.name] = svc.healthCheck;
    }
  });
  // Build health check service
  const healthImpl = new health.Implementation(healthStatusMap);
  server.addService(health.service, healthImpl);

  server.bind(address, grpc.ServerCredentials.createInsecure());
  server.start();

  console.log('');
  console.log(`Lando Server (${process.env['LANDO_ENV']}) running at: ${address}`);
}

module.exports = server;
