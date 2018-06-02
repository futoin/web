---
path: /docs/eventstream/push/
---

# Event Pushing

The pushing approach has the same requirement for events to be marked "delivered".
The same consumer may event mix usage of polling and receiving pushed events in
very specific cases.

There must be a `BiDirectional` channel between Invoker and Executor. Consumer
establishes such channel with initial call to start receiving events. Then
event generating peer starts to push events through callbacks efficient way.

## PushService configuration

`PushService` extends `PollService` and supports all its options with addition of
the following for `DBPushService`:

* `sleep_min=100` - minimal sleep in milliseconds on lack of unread events.
* `sleep_max=3000` - maximal sleep in milliseconds on lack of unread events.
* `sleep_step=100` - sleep time increase on lack of events.

## Registration for reliable delivery

The same as for polling.

## Start receiving events

* `readyToReceive(as, component, want)`
    - parameters have the same meaning as in polling.
    - start sending events through receiver callbacks upon completion of the call.

A child class of `ReliableReceiverService` should be created to properly
handle incoming events. A bi-directional channel like WebSockets or Internal
must be used.

A separate Executor instance should be created for use in endpoint callbacks.

```javascript
class UserReceiver extends ReliableReceiverService
{
    _onEvents( as, reqinfo, events ) {
        // ...
    }
}

const executor = Executor(ccm);
UserReceiver.register(as, executor);
PushFace.register(as, ccm, '#evtpush', endpoint, credentials, { executor } );

const evtpush = ccm.iface('#evtpush');
evtpush.registerConsumer(as, 'Component');
evtpush.readyToReceive(as, 'Component');
```

**As it's quite a lot of boilerplate code, please consider using `EventReceiver` helper instead.**
