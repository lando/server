'use strict';

class BuildStep {
  constructor(weight=0) {
    this.buildSteps = [];
    this.paramValues = [];
    this.state = 'init';
    this.weight = weight;
  }
}

/**
 * Factory to create a sealed BuildStep object.
 * @param weight
 * @returns {BuildStep}
 */
const CreateBuildStep = weight => {
  const obj = new BuildStep(weight);
  Object.seal(obj);
  return obj;
}

module.exports = {
  BuildStep,
  CreateBuildStep,
}
