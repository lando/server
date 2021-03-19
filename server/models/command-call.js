
class CommandCall {
  constructor(cmd, app, opts={}) {
    this.cmd = cmd;
    this.app = app;
    this.opts = opts;
    this.stages = [];
  }
}

module.exports = {
  CommandCall,
}
