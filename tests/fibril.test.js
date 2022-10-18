const F = require('../src/fibril.js');

/* test template
test('', () => {
  expect().toBe();
});
*/

test('new fibril has an id one higher than the previous fibril', () => {
  const fib1 = new F.Fibril('first');
  const fib2 = new F.Fibril('second');
  expect(fib2.id()).toBe(fib1.id() + 1);
});

test('can create a new fibril', () => {
  expect(new F.Fibril('test')).toBeTruthy();
});

test('new fibril is an object with three public properties', () => {
  expect(Object.keys(new F.Fibril('test')).length).toBe(3);
});

test('new fibril has property id', () => {
  expect(new F.Fibril('test')).toHaveProperty('id');
});

test('new fibril has property label', () => {
  expect(new F.Fibril('test')).toHaveProperty('label');
});

test('new fibril has property resonance', () => {
  expect(new F.Fibril('test')).toHaveProperty('resonance');
});

test('new fibril has property space', () => {
  expect(new F.Fibril('test')).toHaveProperty('space');
});

test('fibril can be renamed', () => {
  const fibril = new F.Fibril('Ugly');
  fibril.rename('Beautiful');
  expect(fibril.label).toBe('Beautiful');
});

test('a fibril\'s space may be changed', () => {
  const fibril = new F.Fibril('Test');
  const string = '1, 2, 3, a happy family!';
  fibril.setSpace(string);
  expect(fibril.space).toBe(string);
});
