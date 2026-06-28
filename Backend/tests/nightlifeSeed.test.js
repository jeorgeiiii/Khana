const test = require('node:test');
const assert = require('node:assert/strict');
const { nightlifePlaces } = require('../seed/nightlife');

test('nightlife seed file exports sample places', () => {
  assert.ok(Array.isArray(nightlifePlaces), 'nightlifePlaces should be an array');
  assert.ok(nightlifePlaces.length > 0, 'nightlifePlaces should contain seed data');
  const firstPlace = nightlifePlaces[0];
  assert.ok(firstPlace.name, 'seed place should have a name');
  assert.ok(firstPlace.location, 'seed place should have a location');
  assert.ok(firstPlace.cuisine, 'seed place should have cuisine');
});
