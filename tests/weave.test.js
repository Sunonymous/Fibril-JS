'use strict';

const W = require('../src/weave.js');
const F = require('../src/fibril.js');

// CREATION
test('weaves can be created', () => {
  const weave = new W.Weave();
  expect(weave).toBeTruthy();
  expect(weave).toHaveProperty('label');
  expect(weave).toHaveProperty('refreshAfter', 0);
});

test('weaves are untitled without given name', () => {
  expect(new W.Weave()).toHaveProperty('label', 'Untitled Weave');
});

test('weaves receive the name provided', () => {
  const weave = new W.Weave('Tasks');
  expect(weave.label).toBe('Tasks');
});

test('weaves have only three public properties', () => {
  const weave = new W.Weave('Test');
  expect(Object.keys(weave).length).toBe(3);
});

// RENAME
test('weaves may be renamed', () => {
  const weave   = new W.Weave('Stymied');
  const newName = 'Super'; weave.rename(newName); expect(weave.label).toBe(newName);
});

test('trying to rename a weave when given a non-string throws error', () => {
  const weave   = new W.Weave('Stymied');
  expect(() => weave.rename(42)).toThrow(/string/);
});

// COUNT
test('weaves start empty and can return the number of fibrils they contain', () => {
  const weave = new W.Weave('Test');
  expect(weave.count()).toBe(0);
});

// fibrilIDs
test('weaves can return an array of their fibrils\' ids', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const fibril3 = new F.Fibril('TestFibril3');
  const ids = [fibril1.id(), fibril2.id(), fibril3.id()];
  weave.add(fibril1);
  weave.add(fibril2);
  weave.add(fibril3);
  expect(weave.fibrilIDs()).toEqual(expect.arrayContaining(ids));
});

// ADD
test('weaves can add a fibril', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(weave.count()).toBe(1);
});

test('adding a non-fibril object throws an error', () => {
  const weave = new W.Weave('TestWeave');
  expect(() => weave.add(42)).toThrow(/fibril object/);
  expect(() => weave.add('New Fibril')).toThrow(/fibril object/);
  expect(() => weave.add({id: 42, label: 'Pretend Fibril', resonance: 7, space: ''})).toThrow(/fibril object/);
});

test('adding the same fibril object twice into a weave does nothing', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(weave.add(fibril)).toBe(false);
});

test('adding a fibril with a duplicate name into a weave does nothing', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  const dupFibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(weave.add(dupFibril)).toBe(false);
});

test('adding a fibril raises the refresh queue', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  expect(weave.refreshAfter).toBe(0);
  weave.add(fibril);
  expect(weave.refreshAfter).toBe(1);
});

// REMOVE
test('weaves can remove a fibril by label', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(weave.count()).toBe(1);
  const removed = weave.remove('TestFibril');
  expect(removed).toBe(fibril);
  expect(weave.count()).toBe(0);
});

test('weaves can remove a fibril by reference', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  const removed = weave.remove(fibril);
  expect(removed).toBe(fibril);
  expect(weave.count()).toBe(0);
});

test('weaves can remove a fibril by id', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  const id = fibril.id();
  const removed = weave.remove(id);
  expect(removed).toBe(fibril);
  expect(weave.count()).toBe(0);
});

test('removing a fibril raises the refresh queue', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(weave.refreshAfter).toBe(1);
  weave.remove(fibril);
  expect(weave.refreshAfter).toBe(0);
});

// CONTENTS
test('weaves can produce an array of their fibrils and respective IDs', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const fibril3 = new F.Fibril('TestFibril3');
  weave.add(fibril1);
  expect(weave.contents()[0]).toHaveProperty('id', fibril1.id());
  expect(weave.contents()[0]).toHaveProperty('label', fibril1.label);
  weave.add(fibril2);
  weave.add(fibril3);
  expect(weave.contents()[0]).toHaveProperty('id', fibril1.id());
  expect(weave.contents()[0]).toHaveProperty('label', fibril1.label);
  expect(weave.contents()[1]).toHaveProperty('id', fibril2.id());
  expect(weave.contents()[1]).toHaveProperty('label', fibril2.label);
  expect(weave.contents()[2]).toHaveProperty('id', fibril3.id());
  expect(weave.contents()[2]).toHaveProperty('label', fibril3.label);
});

// EMPTY
test('weaves can empty their fibrils', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  weave.empty();
  expect(weave.count()).toBe(0);
});

// BOOST
test('boosting an empty weave returns false', () => {
  const weave = new W.Weave('TestWeave');
  expect(weave.boost()).toBe(false);
});

test('boost moves fibril at front to the back', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const fibril3 = new F.Fibril('TestFibril3');
  weave.add(fibril1);
  weave.add(fibril2);
  weave.add(fibril3);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.boost();
  expect(weave.contents()[0].id).toBe(fibril2.id());
  weave.boost();
  expect(weave.contents()[0].id).toBe(fibril3.id());
});

test('boosting a weave with only one fibril leaves it in place', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  weave.add(fibril1);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.boost();
  expect(weave.contents()[0].id).toBe(fibril1.id());
});

test('boost raises the resonance of the first fibril by the config delta', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.add(fibril2);
  weave.boost();
  expect(fibril1.resonance).toBe(startingResonance + W.DEFAULT_CONFIG.boostDelta);
});

test('boost lowers the refreshAfter queue amount', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.add(fibril2);
  weave.boost();
  expect(weave.refreshAfter).toBe(1);
});

// PASS
test('passing an empty weave returns false', () => {
  const weave = new W.Weave('TestWeave');
  expect(weave.pass()).toBe(false);
});

test('pass moves fibril at front to the back', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const fibril3 = new F.Fibril('TestFibril3');
  weave.add(fibril1);
  weave.add(fibril2);
  weave.add(fibril3);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.pass();
  expect(weave.contents()[0].id).toBe(fibril2.id());
  weave.pass();
  expect(weave.contents()[0].id).toBe(fibril3.id());
});

test('passing a weave with only one fibril leaves it in place', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  weave.add(fibril1);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.pass();
  expect(weave.contents()[0].id).toBe(fibril1.id());
});

test('pass lowers the resonance of the first fibril by the config delta', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.pass();
  expect(fibril1.resonance).toBe(startingResonance + W.DEFAULT_CONFIG.passDelta);
});

test('pass lowers the refreshAfter queue amount', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.add(fibril2);
  weave.pass();
  expect(weave.refreshAfter).toBe(1);
});

// DRAIN
test('draining an empty weave returns false', () => {
  const weave = new W.Weave('TestWeave');
  expect(weave.drain()).toBe(false);
});

test('drain moves fibril at front to the back', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const fibril3 = new F.Fibril('TestFibril3');
  weave.add(fibril1);
  weave.add(fibril2);
  weave.add(fibril3);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.drain();
  expect(weave.contents()[0].id).toBe(fibril2.id());
  weave.drain();
  expect(weave.contents()[0].id).toBe(fibril3.id());
});

test('draining a weave with only one fibril leaves it in place', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  weave.add(fibril1);
  expect(weave.contents()[0].id).toBe(fibril1.id());
  weave.drain();
  expect(weave.contents()[0].id).toBe(fibril1.id());
});

test('drain lowers the resonance of the first fibril by the config delta', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.drain();
  // plus because delta is negative
  expect(fibril1.resonance).toBe(startingResonance + W.DEFAULT_CONFIG.drainDelta);
});

test('drain lowers the refreshAfter queue amount', () => {
  const weave = new W.Weave('TestWeave');
  const fibril1 = new F.Fibril('TestFibril1');
  const fibril2 = new F.Fibril('TestFibril2');
  const startingResonance = fibril1.resonance;
  weave.add(fibril1);
  weave.add(fibril2);
  weave.drain();
  expect(weave.refreshAfter).toBe(1);
});

// should be the same for pass because it's testing the same private function
test('drain does NOT cause infinite loops when all fibrils pass lens', () => {
  const weave = new W.Weave('TestWeave');
  const fibril = new F.Fibril('TestFibril');
  weave.add(fibril);
  expect(() => {
    weave.drain();
    weave.drain();
    weave.drain();
    weave.drain(); // we exceed necessity here
    weave.drain();
    weave.drain();
    weave.drain();
    weave.drain();
    weave.drain();
  }).not.toThrow();
});

// RELOCATE
test('fibrils can be relocated to another weave when given reference', () => {
  const weave1 = new W.Weave('TestWeave1');
  const weave2 = new W.Weave('TestWeave2');
  const fibril = new F.Fibril('TestFibril');
  weave1.add(fibril);
  expect(weave1.count()).toBe(1);
  expect(weave2.count()).toBe(0);
  weave1.relocate(weave2, fibril);
  expect(weave1.count()).toBe(0);
  expect(weave2.count()).toBe(1);
});

test('fibrils can be relocated to another weave when given number ID', () => {
  const weave1 = new W.Weave('TestWeave1');
  const weave2 = new W.Weave('TestWeave2');
  const fibril = new F.Fibril('TestFibril');
  weave1.add(fibril);
  expect(weave1.count()).toBe(1);
  expect(weave2.count()).toBe(0);
  weave1.relocate(weave2, fibril.id());
  expect(weave1.count()).toBe(0);
  expect(weave2.count()).toBe(1);
});

test('fibrils can be relocated to another weave when given label', () => {
  const weave1 = new W.Weave('TestWeave1');
  const weave2 = new W.Weave('TestWeave2');
  const fibril = new F.Fibril('TestFibril');
  weave1.add(fibril);
  expect(weave1.count()).toBe(1);
  expect(weave2.count()).toBe(0);
  weave1.relocate(weave2, 'TestFibril');
  expect(weave1.count()).toBe(0);
  expect(weave2.count()).toBe(1);
});

test('trying to relocate to a non-weave throws an error', () => {
  const weave1 = new W.Weave('TestWeave1');
  const fibril = new F.Fibril('TestFibril');
  weave1.add(fibril);
  expect(() => weave1.relocate(undefined, fibril)).toThrow(/Must be given a weave/);
  expect(() => weave1.relocate(42, fibril)).toThrow(/Must be given a weave/);
  expect(() => weave1.relocate('SuperWeave', fibril)).toThrow(/Must be given a weave/);
});

test('trying to relocate an incorrect fibril throws an error', () => {
  const weave1 = new W.Weave('TestWeave1');
  const weave2 = new W.Weave('TestWeave2');
  const fibril = new F.Fibril('TestFibril');
  weave1.add(fibril);
  expect(() => weave1.relocate(weave2, 'Strange Faces')).toThrow(/Could not locate/);
  expect(() => weave1.relocate(weave2, new F.Fibril('blank'))).toThrow(/Could not locate/);
  expect(() => weave1.relocate(weave2, 4242)).toThrow(/Could not locate/);
  expect(() => weave1.relocate(weave2, null)).toThrow(/Must provide a Fibril object/);
  expect(() => weave1.relocate(weave2)).toThrow(/Must provide a Fibril object/);
});

// SORTING
test('weaves sort fibrils from highest to lowest resonance', () => {
  const   weave = new W.Weave('TestWeave');
  const    high = new F.Fibril('TestFibril1');
  const  medLow = new F.Fibril('TestFibril2');
  const medHigh = new F.Fibril('TestFibril3');
  const     low = new F.Fibril('TestFibril4');
  weave.add(medLow);
  weave.add(high);
  weave.add(low);
  weave.add(medHigh);
  weave.pass();
  weave.boost();
  weave.drain();
  weave.sort(); // calling sort manually
  const ids = weave.contents().map((f) => f.id);
  expect(ids[0]).toBe(high.id());
  expect(ids[1]).toBe(medHigh.id());
  expect(ids[2]).toBe(medLow.id());
  expect(ids[3]).toBe(low.id());
});

test('weaves auto-sort after refreshQueue reaches zero', () => {
  const weave = new W.Weave('TestWeave');
  const  high = new F.Fibril('TestFibril1');
  const   med = new F.Fibril('TestFibril2');
  const   low = new F.Fibril('TestFibril4');
  weave.add(low);
  weave.add(med);
  weave.add(high);
  weave.drain();
  weave.pass();
  weave.boost(); // should auto sort after this one
  const ids = weave.contents().map((f) => f.id);
  expect(ids[0]).toBe(high.id());
  expect(ids[1]).toBe(med.id());
  expect(ids[2]).toBe(low.id());
});
