class BuildStep {
  constructor(weight=0) {
    this.weight = weight;
    this.paramValues = [];
    this.buildSteps = [];
  }
}

module.exports = {
  BuildStep: BuildStep,
}
