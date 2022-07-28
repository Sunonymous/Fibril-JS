'use strict';

// Fibril
// Lowest level objects for the Fibril application.

// Properties of Fibrils
// id        - Unique identifier for each fibril. Tracked privately based on number of fibrils created.
// label     - Public label to identify each fibril.
// resonance - Level of energy/attention the fibril has received. Adjusts upon each interaction.
// space     - A fibril's space contains notes about the fibril. Editable at will.

let fibrilsCreated = 0; // used to assign IDs
function genNextID() {
  const currentID = fibrilsCreated;
  fibrilsCreated += 1;
  return currentID;
}

// Config contains values which may change used in the program.
const config = {
  boostDelta: 1,
  passDelta: -0.5,
  drainDelta: -1.5,
  startingResonance: 7,
};

class Fibril {
  constructor(label='Unnamed Fibril', space='') {
    this.id        = genNextID();
    this.label     = label;
    this.resonance = config.startingResonance
    this.space     = space;
    return this;
  }

  // Hopefully validation will be done wherever the input is derived!
  rename(newName) {
    this.label = newName;
  }

  setSpace(newData) {
    this.space = newData;
  }

  #adjustResonance(amt) {
    this.resonance += amt;
  }

  boost() {
    this.#adjustResonance(config.boostDelta);
  }

  pass() {
    this.#adjustResonance(config.passDelta);
  }

  drain() {
    this.#adjustResonance(config.drainDelta);
  }
}

module.exports = {
  Fibril,
}
