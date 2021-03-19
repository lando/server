require('../bootstrap');
const grpc = require('grpc');

const lando_pb = require('../build/protos/lando_pb');
const lando_grpc = require('../build/protos/lando_grpc_pb');

const getClient = () => {
  return new lando_grpc.LandoClient(
    process.env['LANDO_ADDR'],
    grpc.credentials.createInsecure(),
  );
}

const callList = () => {
  const client = getClient();
  const req = new lando_pb.ListRequest();
  req.setApp('foo');

  client.list(req, (err, res) => {
    if (!err) {
      console.log('List res:', res.getCommandsList());
    } else {
      console.log('List err:', err);
    }
  });
};

const callVersion = () => {
  const client = getClient();
  const req = new lando_pb.versionRequest();
  client.version(req, (err, res) => {
    if (!err) {
      console.log('Version res:', res.getVersion());
    } else {
      console.log('Version err:', err);
    }
  });
};


const main = () => {
  callList();
  callVersion();
};

main();
