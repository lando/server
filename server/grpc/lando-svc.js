const { CommandCall } = require('../models/command-call');
const lando_pb = require('../../build/protos/lando_pb');
const lando_grpc = require('../../build/protos/lando_grpc_pb');
const commands = require('../lib/commands');

const SERVICE_NAME = 'LandoService';

/**
 * For a smart health check, dynamically return one of the following:
 *   proto.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING
 *   proto.grpc.health.v1.HealthCheckResponse.ServingStatus.NOT_SERVING
 * For a dumb health check, just return SERVING
 */
const healthCheck = () => {
  return proto.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING;
};

/**
 * Implement list()
 */
const list = (call, callback) => {
  // Fetch app from call (if applicable)
  const app = call.request.getApp();
  // Initialize a listResponse
  const listResponse = new lando_pb.ListResponse();
  // Add commands to the response
  const commandList = commands.getCommands(app);
  const commandMetaList = [];
  commandList.forEach(command => {


    // Create the pb CommandMeta object from the command object.
    const cm = new lando_pb.CommandMeta();
    cm.setCmd(command.cmd);
    cm.setScope(command.scope);
    cm.setDescription(command.description);
    // Add the pb object to the response.
    listResponse.addCommands(command.toPb());
  })
  // Send Response
  callback(null, listResponse);
};

/**
 * Implement run()
 */
const run = (call, callback) => {
  const command = call.request.getCommand();
  const app = call.request.getApp();
  const options = call.request.getOptions();
  const cc = new CommandCall(command, app, options);

  callback(null, RunResponse());
};


/**
 * Implement list()
 */
const version = (call, callback) => {
  const res = new lando_pb.VersionResponse();
  res.setVersion('4.0.0-dev');
  callback(null, res)
}

/*
 * Export standard service properties: definition, healthCheck, & implementation.
 */
module.exports = {
  name: SERVICE_NAME,
  definition: lando_grpc.LandoService,
  implementation: {list, run, version},
  healthCheck,
};
