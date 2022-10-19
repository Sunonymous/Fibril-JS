'use strict';

const F = require('./fibril.js');

// Weave
// Weaves manage multiple fibrils.

// Properties
// label - Public name for the weave.
// #fibrils - Private field array of individual fibrils.
// config -

// Functionality
// create
// rename   -- changes label/name of weave
// add      -- adds a new fibril
// count    -- returns total number of fibrils
// contents -- returns an array of fibrils in the form of {id, label}
// remove   -- removes a fibril (may be given fibril directly, or ID number, or string label)
// empty    -- removes all fibrils in weave
// boost    -- boosts first fibril in weave and moves it to the back
// pass     -- passes first fibril in weave and moves it to the back
// drain    -- drains first fibril in weave and moves it to the back
// sort     -- sorts fibrils from highest to lowest resonance
//              invoked automatically after all fibrils have been interacted with
// relocate !!
// interact !!

const DEFAULT_CONFIG = {
  mode: 'weave',
  focus: 'long',
  lens: 4,
  boostDelta:  1,
  passDelta:  -0.5,
  drainDelta: -1,
}

class Weave {
  #fibrils;
  #config;
  static #indexFunctions = function() {
    return {
      string: this.#indexByLabel,
      number: this.#indexByID,
      object: this.#indexByReference,
    };
  }

  constructor(label='Untitled Weave') {
    this.label = label;
    this.#fibrils = [];
    this.#config = DEFAULT_CONFIG;
    this.refreshAfter = 0;
    this.lens = DEFAULT_CONFIG.lens;
  }

  rename(newName) {
    if (typeof newName !== 'string') throw('May only rename a weave when given a string.');
    this.label = newName;
  }

  contents() {
    return this.#fibrils.map((f) => {
      return {id: f.id(), label: f.label};
    });
  }

  // duplicate fibrils are not allowed!
  add(fibril) {
    if (!(fibril instanceof F.Fibril)) throw('May only add fibril objects!');
    if (this.#fibrilProperties('label').includes(fibril.label) ||
        this.#fibrils.includes(fibril)) {
      return false;
    } else {
      this.#fibrils.push(fibril);
      this.refreshAfter += 1;
      return true;
    }
  }

  count() {
    return this.#fibrils.length;
  }

  #indexByReference(ref) { return this.#fibrils.findIndex((f) => f === ref); }
  #indexByID(id)         { return this.#fibrils.findIndex((f) => f.id() === id); }
  #indexByLabel(label)   { return this.#fibrils.findIndex((f) => f.label === label); }

  // used to check for duplicates when adding a new fibril
  #fibrilProperties(prop) {
    return this.#fibrils.map((f) => {
      if (typeof f[prop] === 'function') {
        return f[prop](); // private fields (eg. id) must be called as functions
      } else {
        return f[prop];
      }
    });
  }
  // wrapper function(s)
  fibrilIDs() {
    return this.#fibrilProperties('id');
  }

  // #indexFunctions returns the proper function to search with based on the
  //   type of the `query` argument
  remove(query) {
    const   func = Weave.#indexFunctions.call(this)[typeof query];
    const  index = func.call(this, query);
    if (index === -1) {
      return null;
    } else {
      this.refreshAfter -= 1;
      return this.#fibrils.splice(index, 1)[0];
    }
  }

  empty() {
    this.#fibrils = [];
  }

  sort() {
    this.#fibrils.sort((f1, f2) => f1.resonance - f2.resonance).reverse();
    const visibleFibrils = this.#fibrilProperties('resonance').filter((r) => r >= this.lens);
    this.refreshAfter = visibleFibrils.length;
  }

  relocate(newWeave, fibrilToMove) {
    if (newWeave === undefined || newWeave === null || !(newWeave instanceof Weave)) {
      throw('Must be given a weave to transfer fibril too.');
    } else if (fibrilToMove === undefined || fibrilToMove === null || !(['string', 'number', 'object'].includes(typeof fibrilToMove))) {
      throw('Must provide a Fibril object or valid identifier for the Fibril to remove.');
    } else {
      const removedFibril = this.remove(fibrilToMove);
      if (removedFibril === null) {
        throw('Could not locate requested fibril for relocation.');
      } else {
        newWeave.add(removedFibril);
        return true;
      }
    }
  }

  #shiftFibrils() {
    this.#fibrils.push(this.#fibrils.shift());
    this.refreshAfter -= 1;
    // to prevent an infinite loop, return if all fibrils are under lens threshold
    if (this.#fibrilProperties('resonance').every((r) => r < this.lens)) {
      return; // this and the while loop below are not covered by tests,
      // though without them the program wouldn't work correctly.
      // watch closely until better solution appears
    }
    // continue to move fibrils until a fibril is above lens threshold
    // these "invisible" fibrils do not affect refresh queue
    while (this.#fibrils[0].resonance < this.lens) {
      this.#fibrils.push(this.#fibrils.shift());
    }
    if (this.refreshAfter <= 0) {
      this.sort();
    }
  }

  #adjustResonance(amount) {
    if (this.count() === 0) {
      return false;
    } else {
      this.#fibrils[0].resonance += amount;
    }
    if (this.count() > 1) this.#shiftFibrils();
  }

  boost() {
    // should boost be capped?
    return this.#adjustResonance(this.#config.boostDelta);
  }

  pass() {
    return this.#adjustResonance(this.#config.passDelta);
  }

  drain() {
    return this.#adjustResonance(this.#config.drainDelta);
  }
}

module.exports = {
  Weave,
  DEFAULT_CONFIG,
}
