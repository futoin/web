---
path: /docs/miscjs/asyncevent/
---

# JS: futoin-asyncevent

Implementation of [FTN15: Native Event API v1.x](https://specs.futoin.org/final/preview/ftn15_native_event-1.html).

* [GitHub](https://github.com/futoin/core-js-ri-asyncevent)
* [GitLab](https://gitlab.com/futoin/core/js/ri-asyncevent)
* [npmjs](https://www.npmjs.com/package/futoin-asyncevent)


Implementation of a well-known event emitter pattern, but with fundamental requirement: execute
all events asynchronously - there must be no emitter functionality function frames on the stack.

All other event emitters implementations are synchronous - they call handlers when event is emitted.
As there is a known security-related timing problem of `setTimeout()` calls in browser, enhanced
event loop is used from [futoin-asyncsteps](https://www.npmjs.com/package/futoin-asyncsteps) module.

Second important feature - strict check of allowed event types.

## Extra details


1. ActiveAsyncTool from AsyncSteps is used for each handler.
    - All exceptions can be traced runtime-defined way - exceptions are forced to be re-thrown in dedicated event loop call
    - Performance of setImmediate() with workaround for security-related slowdown in browsers.
    - A single immediate is used for regular execution of event.
2. `EventEmitter` instance is hidden in `target[EventEmitter.SYM_EVENT_EMITTER]` property.
    - Almost no pollution to target object
    - Very fast lookup
    - `on()`, `off()`, `once()` and `emit()` are defined as properties which proxy call
3. At the moment, `emit()` uses ES6 spread oprerator (e.g. `...args`):
    - the approach which is around 4 times faster in Node.js compared to old ES5 browsers
    - there are no optimizations done yet (no significant case so far)
4. Each event has own "on" and "once" arrays:
    - performance over memory tradeoff
    - "once" array is simply discarded and replaced after first use, if there are any handlers
    - `on()`/`once()` calls are cheap
    - `off()` call uses `array#filter()`
    - the same handler can be added more than once, but it gets removed on first `off()` call
    - `off()` removes handler both from "on" and "once" arrays
5. Async event dispatch considerations:
    - `once( 'event', () => o.once( 'event', ... ) )` approach IS NOT SAFE as it leads to missed events!
    - avoid emitting too many events in a synchronous loop - event handlers get scheduled, but not executed!

# Installation for Node.js

Command line:
```sh
$ npm install futoin-asyncevent --save
```
or
```sh
$ yarn add futoin-asyncevent
```

*Hint: checkout [FutoIn CID](https://github.com/futoin/cid-tool) for all tools setup.*

# Browser installation

Pre-built ES5 CJS modules are available under `es5/`. These modules
can be used with `webpack` without transpiler - default "browser" entry point
points to ES5 version.

Webpack dists are also available under `dist/` folder, but their usage should be limited
to sites without build process.

*Warning: older browsers should use `dist/polyfill-asyncevent.js` for `Symbol`.*

*The following globals are available:*

* $asyncevent - global reference to futoin-asyncevent module
* futoin - global namespace-like object for name clashing cases
* futoin.$asyncevent - another reference to futoin-asyncevent module
* futoin.EventEmitter - global reference to futoin-asyncevent.EventEmitter class

# Examples

## Simple steps

```javascript
const $asyncevent = require('futoin-asyncevent');

class FirstClass {
    constructor() {
        // dynamically extend & pre-configure allowed events
        $asyncevent(this, ['event_one', 'event_two', 'event_three']);
    }
    
    someFunc() {
        this.emit( 'event_one', 'some_arg', 2, true );
    }
}

const o = new FirstClass();
const h = (a, b, c) => console.log(a, b, c);

// Basic event operation
// ---------------------
o.on('event_one', h);
o.off('event_one', h);
o.once('event_two', () => console.log('Second'));
o.someFunc();

// Advanced
// --------

// instanceof hook (ES6)
(o instanceof $asyncevent.EventEmitter) === true

// update max listeners warning threshold
$asyncevent.EventEmitter.setMaxListeners( o, 16 );

// Additional events in derived class
// ----------------------------------
class DerivedClass extends FirstClass {
    constructor() {
        super();
        // Transparently checks, if EventEmitter has been already
        // registered with other events
        $asyncevent(this, ['another_event']);
    }
}

// Fail on duplicate event names
// ----------------------------------
class FailClass extends FirstClass {
    constructor() {
        super();
        // It's not allowed to override already registered event for
        // safety reasons.
        $asyncevent(this, ['event_one']);
    }
}

```
