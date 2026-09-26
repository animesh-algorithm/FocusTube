const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('saved Shorts preference hides cards and updates an open tab', async () => {
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
      sync: { get: () => Promise.resolve({ settings: { shorts: true } }) },
      onChanged: { addListener: callback => { onChanged = callback; } }
    } }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../settings.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(require.resolve('../content.js'), 'utf8'), context);
  await Promise.resolve();
  assert.ok(attributes.has('data-focus-tube-shorts'));
  assert.ok(observed);
  onChanged({ settings: { newValue: { shorts: false } } }, 'sync');
  assert.ok(!attributes.has('data-focus-tube-shorts'));
  assert.ok(!observed);
});

test('a setting changed during startup is not overwritten by an older read', async () => {
  const attributes = new Set();
  let onChanged;
  let finishRead;
  const context = {
    document: {
      documentElement: { toggleAttribute: (name, enabled) => enabled ? attributes.add(name) : attributes.delete(name) },
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    location: { pathname: '/', replace: () => assert.fail('unexpected redirect') },
    requestAnimationFrame: callback => callback(),
    MutationObserver: class { observe() {} disconnect() {} },
    chrome: { storage: {
      sync: { get: () => new Promise(resolve => { finishRead = resolve; }) },
      onChanged: { addListener: callback => { onChanged = callback; } }
    } }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../settings.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(require.resolve('../content.js'), 'utf8'), context);
  onChanged({ settings: { newValue: { shorts: true } } }, 'sync');
  finishRead({ settings: { shorts: false } });
  await Promise.resolve();
  assert.ok(attributes.has('data-focus-tube-shorts'));
});

test('Shorts stays enabled while YouTube has not rendered cards yet', async () => {
  const attributes = new Set();
  const root = {
    toggleAttribute: (name, enabled) => enabled ? attributes.add(name) : attributes.delete(name),
    querySelector: () => null,
    removeAttribute: name => attributes.delete(name)
  };
  const context = {
    document: {
      documentElement: root,
      querySelectorAll: selector => selector.includes('data-focus-tube-shorts') ? [root] : [],
      addEventListener: () => {}
    },
    location: { pathname: '/', replace: () => assert.fail('unexpected redirect') },
    requestAnimationFrame: callback => callback(),
    MutationObserver: class { observe() {} disconnect() {} },
    chrome: { storage: {
      sync: { get: () => Promise.resolve({ settings: { shorts: true } }) },
      onChanged: { addListener: () => {} }
    } }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../settings.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(require.resolve('../content.js'), 'utf8'), context);
  await Promise.resolve();
  assert.ok(attributes.has('data-focus-tube-shorts'));
});
