'use strict';

const EventEmitter = require('events');

class StateMachine extends EventEmitter {
  constructor(config) {
    super();
    this.validate(config)
    this.id = config.id;
    this.state = config.initialState;
    this.config = config;
    this.handlers = config.handlers;
  }

  /**
   * Transitions from current state
   * @param transition
   * @param context
   */
  apply(transition, context=null) {
    if (!this.can(transition)) {
      throw `Unable to transition with: ${transition} from: ${this.state}`;
    }
    // Call pre transition handlers.
    if (this.handlers) {
      this.handlers.forEach(handler => {
        // Returning false stops transition.
        if (!handler({transition, complete: false, machine: this, context})) {
          return false;
        }
      });
    }
    this.emit('transition', {transition, complete: false, machine: this, context});

    // Change state
    this.state = this.config.transitions[transition].to;

    // Call post transition handlers.
    if (this.handlers) {
      this.handlers.forEach(handler => {
        handler({transition, complete: true, machine: this, context});
      })
    }
    // Emit event that we're done.
    this.emit('transition', {transition, complete: true, machine: this, context});
  }

  /**
   * Checks if transition can be applied.
   * @param transition
   * @returns {boolean} True if transition is valid
   */
  can(transition) {
    if (!this.config.transitions[transition]) {
      throw `Invalid transition: ${transition}`;
    }
    const t = this.config.transitions[transition];
    // Verify current state is a valid from state for this transition.
    return !((Array.isArray(t.from) && !t.from.includes(this.state)) || t.from !== this.state);
  }

  /**
   * Returns current state.
   */
  get() {
    return this.getState();
  }

  getConfig() {
    return this.config;
  }

  getHandlers() {
    return this.handlers;
  }

  getId() {
    return this.id;
  }

  getState() {
    return this.state;
  }

  /**
   * Returns array of available transitions from the current state.
   */
  transitions() {
    const transitions = [];
    this.config.transitions.forEach(t => {
      if ((Array.isArray(t.from) && t.from.includes(this.state)) || t.from === this.state) {
        transitions.push(t.to);
      }
    });
    return transitions;
  }

  validate(config) {
    const required = ['id', 'initialState', 'states', 'transitions'];
    required.forEach(key => {
      if (!config[key]) {
        throw `Missing config property: ${key}`
      }
    });
    if (!Array.isArray(config.states)) {
      throw 'Config "states" must be an array'
    }
    for (const [key, t] of Object.entries(config.transitions)) {
      if (!t.from || !t.to) {
        throw 'All transitions must have "from" and "to" states defined';
      }
      if (Array.isArray(t.from)) {
        t.from.forEach(state => {
          if (!config.states.includes(state)) {
            throw `Invalid state (${state}) defined in transition ${key}`;
          }
        });
      } else if (!config.states.includes(t.from)) {
        throw `Invalid state (${t.from}) defined in transition ${key}`;
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
//
// const dummyHandler = (event) => {
//   console.log('*****');
//   console.log('transition', event.transition);
//   console.log(event.complete ? 'Complete' : 'Leaving', event.machine.state);
//   console.log(event.machine.config.id, event.machine.state);
//   console.log('context', event.context);
//   console.log('*****');
// }
// //
// const workflows = {
//   publishing: {
//     id: 'publishing',
//     initialState: 'draft',
//     handlers: [dummyHandler],
//     states: [
//       'draft',
//       'reviewed',
//       'rejected',
//       'published',
//     ],
//     transitions: {
//       to_review: {
//         from: 'draft',
//         to: 'reviewed',
//       },
//       publish: {
//         from: 'reviewed',
//         to: 'published',
//       },
//       reject: {
//         from: 'reviewed',
//         to: 'rejected',
//       },
//     },
//   },
// };
//
//
// const machine = new StateMachine(workflows.publishing);
// console.log(`current state: ${machine.state}`);
// state = machine.apply('to_review');
// console.log(`current state: ${machine.state}`);
