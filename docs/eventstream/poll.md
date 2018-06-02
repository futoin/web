---
path: /docs/eventstream/poll/
---

# Event Polling

Event polling is simple, but inefficient mechanism. It should be avoided,
if implementation can support push-receive.

## `PollService` configuration

The following options are supported:

* `allow_reliable = true` - controls, if reliable consumer registration is allowed.
* `allow_polling = true` - controls, if polling is enabled.
* `max_chunk_events = 100` - control maximum number events which can be returned in
    a single response.

`DBPollService` supports extra options:

* `event_table` - custom events table name
* `consumer_table` - custom consumers table name


## Registration for reliable delivery

This registration must be done regardless if reliable consumer is going to
poll or receive pushed events.

* `registerConsumer(as, component)`
    - `component` - 1 to 16 symbols of upper and lower letters, digits and underscores.

**Registration can be repeated on each startup to simplify logic.**

```javascript
PollFace.register(as, ccm, '#evtpoll', endpoint );
// ...
const evtpoll = ccm.iface('#evtpoll');

// All events
evtpoll.registerConsumer(as, 'AllEvents');
evtpoll.registerConsumer(as, 'Security');
```


## Polling call

Usually, polling is done in a loop. The initial value of `last_known_id_here` should
be stored and read from component-specific persistent configuration. The value must advance
to the last processed event only if processing is complete and cannot be rolled back by
some error or unexpected shutdown.

* `pollEvents( as, component, [last_id [, want]] )`
    * `last_id` - last processed event ID, if any
    * `want` - array of event filters, if any
    * returns array of events

**It's important to note that event processing must be aware of possible repeats!**

```javascript
PollFace.register(as, ccm, '#evtpoll', endpoint );
// ...
const evtpoll = ccm.iface('#evtpoll');
let last_known_id_all_events = read_from_somewhere();
let last_known_id_filtered = read_from_somewhere();

as.loop( (as) => {
    // All events
    evtpoll.pollEvents(as, 'AllEvents', last_known_id_all_events);
    as.add((as, events) => {
        for ( let evt of events ) {
            // do repeat-safe processing here
            last_known_id_all_events = evt.id;
            store_somewhere(last_known_id_all_events);
        }
    });


    // Filtered byte type events
    evtpoll.pollEvents(as, 'Security', last_known_id_filtered, ['USR_ADD', 'USR_MOD', 'USR_LOGIN']);
    as.add((as, events) => {
        // ....
    });
} );

```
