const EventEmitter = require('events');

class StateMachine extends EventEmitter {
  constructor(definition) {
    super();
    if (!this.validate(definition)) {
      throw new Error('Invalid config');
    }
    this.id = definition.id;
    this.state = definition.initialState;
    this.config = definition;
  }

  apply(transition, context=null) {
    if (!this.can(transition)) {
      return false;
    }
    // Call pre transition handlers.
    const handlers = this.config.handlers;
    if (handlers) {
      handlers.forEach(handler => {
        // Returning false stops transition.
        if (!handler({transition, complete: false, machine: this, context})) {
          return false;
        }
      })
    }
    this.emit('transition', {transition, complete: false, machine: this, context});
    // Change state
    this.state = this.config.transitions[transition].to;
    // Call post transition handlers.
    if (handlers) {
      handlers.forEach(handler => {
        handler({transition, complete: true, machine: this, context});
      })
    }
    // Emit event that we're done.
    this.emit('transition', {transition, complete: true, machine: this, context});
  }

  can(transition) {
    if (!this.config.transitions[transition]) {
      throw `Invalid transition: ${transition}`;
    }
    const t = this.config.transitions[transition];
    // Verify current state is a valid from state for this transition.
    return !((Array.isArray(t.from) && !t.from.includes(this.state)) || t.from !== this.state);
  }

  validate(config) {
    const required = ['id', 'initialState', 'states', 'transitions'];
    required.forEach(key => {
      if (!config[key]) {
        throw `Missing definition property: ${key}`
      }
    });
    if (!Array.isArray(config.states)) {
      throw 'Definition must contain a "states" array'
    }
    for (const [key, t] of Object.entries(config.transitions)) {
      if (!t.from || !t.to) {
        console.log(t);
        process.exit()
        throw 'All transitions must have "from" and "to" states defined';
      }
      if (Array.isArray(t.from)) {
        t.from.forEach(state => {
          if (!config.states.includes(state)) {
            throw `Invalid state (${state}) defined in transition ${key}`;
          } else if (!config.states.includes(t.from)) {
            throw `Invalid state (${t.from}) defined in transition ${key}`;
          }
        });
      }
      if (!config.states.includes(t.to)) {
        throw `Invalid state (${t.to}) defined in transition ${key}`;
      }
    }
    return true;
  }
}

module.exports = {
  StateMachine,
}

const dummyHandler = (event) => {
  console.log('*****');
  console.log('transition', event.transition);
  console.log(event.complete ? 'Complete' : 'Leaving', event.machine.state);
  console.log(event.machine.config.id, event.machine.state);
  console.log('context', event.context);
  console.log('*****');
}
//
const workflows = {
  publishing: {
    id: 'publishing',
    initialState: 'draft',
    handlers: [dummyHandler],
    states: [
      'draft',
      'reviewed',
      'rejected',
      'published',
    ],
    transitions: {
      to_review: {
        from: 'draft',
        to: 'reviewed',
      },
      publish: {
        from: 'reviewed',
        to: 'published',
      },
      reject: {
        from: 'reviewed',
        to: 'rejected',
      },
    },
  },
};
//
//
const machine = new StateMachine(workflows.publishing);
console.log(`current state: ${machine.state}`);
state = machine.apply('to_review');
console.log(`current state: ${machine.state}`);
