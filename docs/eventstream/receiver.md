---
path: /docs/eventstream/receiver/
---

# Event Receiver

As there is a bit of boilerplate code needed to start receiving events,
a simple `ReliableEventReceiver` helper is provided.

Only `_onEvents` member needs to be overridden.

## API

* `contructor([ccm])`
    - `ccm` - passed to internally created Executor instance.
    - Receiver listens for `close` events of the `ccm` to properly shutdown.
* `start(endpoint, credentials, options)`
    - `endpoint`, `credentials` and `options` are passed to `CCM#register()`
    - Additional `options` keys:
        - `component` - component name, "LIVE" by default
        - `want` - event filtering parameter, if any
* `stop()`
    - Stop receiver processing
* `_registerReceiver(as, executor, options)`
    - Override to use custom ReliableReceiverService instance
* `_newEvents(as, events)`
    - Override to use it instead of `newEvents` handler.

## Async event API

* `receiverError` - upon event processing error.
* `workerError` - upon general worker error.
* `newEvents` - can be used to sniff raw delivery of events.
* `ready` - upon receiver getting ready to process events.

## Example

```javascript
const ReliableEventReceiver = require( 'futoin-eventreceiver/ReliableEventReceiver' );

const receiver = new ReliableEventReceiver( ccm );

receiver.on('newEvents', (events) => {
    // process
} );

receiver.start( endpoint, credentials, { want: [ 'EVT_TYPE' ] } );

```



