const { Command } = require('../models');

const getCommands = () => {
  const data = [];

  // Hard code commands for now
  // let cmd = new command_pb.CommandDetail();
  let command = new Command('list');
  command.scope = 'global';
  command.description = 'List available commands';
  data.push(command);

  command = new Command('version');
  command.scope = 'global';
  command.description = 'Get Lando server version';
  data.push(command);

  return data;
};


module.exports = {
  Command,
  getCommands,
}
