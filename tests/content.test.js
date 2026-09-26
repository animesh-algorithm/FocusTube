const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('saved Shorts preference hides cards and updates an open tab', () => {
  const attributes = new Set();
  const card = { setAttribute: name => attributes.add(name), removeAttribute: name => attributes.delete(name), querySelector: () => link };
  const link = { closest: () => card };
  let onChanged;
  let observed = false;
  const context = {
    document: {
      documentElement: { toggleAttribute: (name, enabled) => enabled ? attributes.add(name) : attributes.delete(name) },
      querySelectorAll: selector => selector.startsWith('a[') ? [link] : [card],
      addEventListener: () => {}
    },
    location: { pathname: '/watch', replace: () => assert.fail('unexpected redirect') },
    requestAnimationFrame: callback => callback(),
    MutationObserver: class { observe() { observed = true; } disconnect() { observed = false; } },
    chrome: { storage: {
      sync: { get: (_defaults, callback) => callback({ settings: { shorts: true } }) },
      onChanged: { addListener: callback => { onChanged = callback; } }
    } }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../settings.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(require.resolve('../content.js'), 'utf8'), context);
  assert.ok(attributes.has('data-focus-tube-shorts'));
  assert.ok(observed);
  onChanged({ settings: { newValue: { shorts: false } } }, 'sync');
  assert.ok(!attributes.has('data-focus-tube-shorts'));
  assert.ok(!observed);
});
