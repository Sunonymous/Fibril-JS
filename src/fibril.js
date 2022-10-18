'use strict';

// Fibril
// Lowest level objects for the Fibril application.

// Properties of Fibrils
// id        - Unique identifier for each fibril. Tracked privately based on number of fibrils created.
// label     - Public label to identify each fibril.
// resonance - Level of energy/attention the fibril has received. Adjusts upon each interaction.
// space     - A fibril's space contains notes about the fibril. Editable at will.

const nextID = (function() {
  let fibrilsCreated = 0; // used to assign IDs

  function genNextID() {
    const currentID = fibrilsCreated;
    fibrilsCreated += 1;
    return currentID;
  }

  return genNextID;
})();

// Config contains values which may change used in the program.
const config = {
  startingResonance: 7,
};

class Fibril {
  #id;

  constructor(label='Unnamed Fibril', space='') {
    this.#id       = nextID();
    this.label     = label;
    this.resonance = config.startingResonance
    this.space     = space;
    return this;
  }

  id() {
    return this.#id;
  }

  // Hopefully validation will be done wherever the input is derived!
  rename(newName) {
    this.label = newName;
  }

  setSpace(newData) {
    this.space = newData;
  }
}

module.exports = {
  Fibril,
}
