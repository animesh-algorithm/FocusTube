const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULTS, normalizeSettings } = require('../settings.js');

test('new users get defined defaults', () => {
  assert.deepEqual(normalizeSettings(), DEFAULTS);
});

test('saved options are limited to known boolean settings', () => {
  assert.deepEqual(normalizeSettings({ shorts: true, comments: false, unknown: true, recommendations: 'yes' }), {
    comments: false,
    recommendations: true,
    description: false,
    channelInfo: false,
    shorts: true
  });
});
