---
path: /docs/eventstream/discarder/
---

# Event Discarder

As previously noted, it's not feasible to hold whole history of events
in active database due to its performance degradation.

A special `DBEventDiscarder` service helps removing old events while ensuring to keep
events which are unread by reliable consumers.

`DBEventDiscarder` expects `evt` database interface to be pre-configured on passed CCM.

## API

* `start( ccm, options)`
    - start processing
    - `options`:
        - `poll_period_ms=600e3` - event polling interval
        - `limit_at_once=1000` - maximum number of events allowed to be removed at once.
        - `event_table` - event table name
        - `consumer_table` - consumer table name
* `stop()`
    - stop processing

## Async Events

* `workerError` - no expected error during execution.
* `eventDiscard` - count of events discarded in iteration.

## Usage

```javascript
const DBEventDiscarder = require( './DBEventDiscarder' );

// Initialize CCM & DB connection
const ccm = new AdvancedCCM();
DBAutoConfig( as, ccm, { evt: {} } );

// Initialize and start DB Event Discarder helper
const discarder = new DBEventDiscarder();
discarder.on( 'workerError', notExpectedHandler );

as.add( ( as ) => discarder.start( ccm, {} ) );

```
