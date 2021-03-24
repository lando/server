'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.should();
const {StateMachine} = require('../../../server/lib/state-machine');

const dummyHandler = (event) => {
  console.log('*****');
  console.log('transition', event.transition);
  console.log(event.complete ? 'Complete' : 'Leaving', event.machine.state);
  console.log(event.machine.config.id, event.machine.state);
  console.log('context', event.context);
  console.log('*****');
};

const getConfig = () => {
  return {
    id: 'publishing',
    initialState: 'draft',
    handlers: [dummyHandler],
    states: [
      'draft',
      'reviewing',
      'rejected',
      'published',
    ],
    transitions: {
      review: {
        from: 'draft',
        to: 'reviewing',
      },
      publish: {
        from: 'reviewing',
        to: 'published',
      },
      reject: {
        from: 'reviewing',
        to: 'rejected',
      },
    },
  };
};

//
//
// const machine = new StateMachine(workflows.publishing);
// console.log(`current state: ${machine.state}`);
// state = machine.apply('review');
// console.log(`current state: ${machine.state}`);


describe('state-machine initialization', () => {
  it('should initialize with config and state', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    const state = machine.get();
    machine.should.be.instanceOf(StateMachine);
    state.should.equal('draft');
    machine.should.have.property('id', 'publishing');
    machine.should.have.property('state', 'draft');
    machine.should.have.property('config', config);
    machine.should.have.property('handlers', config.handlers);
    const handlers = machine.getHandlers();
    handlers.length.should.equal(1);
  });

  it('should have working getters', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    machine.get().should.equal('draft');
    machine.getConfig().should.equal(config);
    machine.getHandlers().should.equal(config.handlers);
    machine.getId().should.equal('publishing');
    machine.getState().should.equal('draft');
  });
});

describe('state-machine apply transition', () => {
  it('should throw error when passing in invalid transition', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    expect(() => {
      machine.apply('publish',).to.throw('Unable to transition with: publish from: draft');
    });
  });

  // TODO: Add tests to confirm handlers are called and events are emitted.

  it('should transition from draft to reviewing', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    machine.apply('review');
    console.log(machine);
    machine.state.should.equal('reviewing');
  });
});

describe('state-machine can transition', () => {
  it('should throw error when passing in invalid transition', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    expect(() => {
      machine.can('jump',).to.throw('Invalid transition: jump');
    });
  });

  it('should return false if it cannot transition', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    const canTransition = machine.can('publish');
    canTransition.should.equal(false);
  });

  it('should return true if it can transition', () => {
    const config = getConfig();
    const machine = new StateMachine(config);
    const canTransition = machine.can('review');
    canTransition.should.equal(true);
  });
});

describe('state-machine validation', () => {
  it('should throw error with missing config property', () => {
    const required = ['id', 'initialState', 'states', 'transitions'];
    required.forEach(key => {
      expect(() => {
        const config = getConfig();
        delete config[key];
        new StateMachine(config);
      }).to.throw(`Missing config property: ${key}`);
    });
  });

  it('should throw error when config.state is not an array', () => {
    expect(() => {
      const config = getConfig();
      config.states = 'foo';
      new StateMachine(config);
    }).to.throw('Config "states" must be an array');
  });

  it('should throw error with missing from/to in transitions', () => {
    const config = getConfig();
    for (const [key, t] of Object.entries(config.transitions)) {
      expect(() => {
        const config2 = getConfig();
        delete config2.transitions[key].from;
        new StateMachine(config2);
      }).to.throw('All transitions must have "from" and "to" states defined');
      expect(() => {
        const config2 = getConfig();
        delete config2.transitions[key].to;
        new StateMachine(config2);
      }).to.throw('All transitions must have "from" and "to" states defined');
    }
  });

  it('should throw error with invalid transition "from" state', () => {
    const config = getConfig();
    for (const [key, t] of Object.entries(config.transitions)) {
      // Test string value
      expect(() => {
        const config2 = getConfig();
        config2.transitions[key].from = 'invalid-state';
        new StateMachine(config2);
      }).to.throw(`Invalid state (invalid-state) defined in transition ${key}`);
      // Test array value
      expect(() => {
        const config2 = getConfig();
        config2.transitions[key].from = ['invalid-state'];
        new StateMachine(config2);
      }).to.throw(`Invalid state (invalid-state) defined in transition ${key}`);
    }
  });

  it('should throw error with invalid transition "to" state', () => {
    const config = getConfig();
    for (const [key, t] of Object.entries(config.transitions)) {
      // Test array value
      expect(() => {
        const config2 = getConfig();
        config2.transitions[key].to = 'invalid-state';
        new StateMachine(config2);
      }).to.throw(`Invalid state (invalid-state) defined in transition ${key}`);
    }
  });
});
