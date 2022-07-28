const fib = require('../src/fibril.js');

/* test template
test('', () => {
  expect().toBe();
});
*/

test('new fibril has an id one higher than the previous fibril', () => {
  const fib1 = new fib.Fibril('first');
  const fib2 = new fib.Fibril('second');
  expect(fib2.id).toBe(fib1.id + 1);
});

test('can create a new fibril', () => {
  expect(new fib.Fibril('test')).toBeTruthy();
});

test('new fibril is an object with four properties', () => {
  expect(Object.keys(new fib.Fibril('test')).length).toBe(4);
});

test('new fibril has property id', () => {
  expect(new fib.Fibril('test')).toHaveProperty('id');
});

test('new fibril has property label', () => {
  expect(new fib.Fibril('test')).toHaveProperty('label');
});

test('new fibril has property resonance', () => {
  expect(new fib.Fibril('test')).toHaveProperty('resonance');
});

test('new fibril has property space', () => {
  expect(new fib.Fibril('test')).toHaveProperty('space');
});

test('fibril can be renamed', () => {
  const fibril = new fib.Fibril('Ugly');
  fibril.rename('Beautiful');
  expect(fibril.label).toBe('Beautiful');
});

test('a fibril\'s resonance may be boosted', () => {
  const fibril = new fib.Fibril('Test');
  const initialResonance = fibril.resonance;
  fibril.boost();
  expect(fibril.resonance).toBeGreaterThan(initialResonance);
});

test('a fibril\'s resonance may be passed', () => {
  const fibril = new fib.Fibril('Test');
  const initialResonance = fibril.resonance;
  fibril.pass();
  expect(fibril.resonance).toBeLessThan(initialResonance);
});

test('a fibril\'s resonance may be drained', () => {
  const fibril = new fib.Fibril('Test');
  const initialResonance = fibril.resonance;
  fibril.drain();
  expect(fibril.resonance).toBeLessThan(initialResonance);
});

test('a fibril\'s space may be changed', () => {
  const fibril = new fib.Fibril('Test');
  const string = '1, 2, 3, a happy family!';
  fibril.setSpace(string);
  expect(fibril.space).toBe(string);
});
