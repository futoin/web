---
path: /docs/eventstream/gen/
---

# Event Generation

There are two ways to generate events: API call and DB query in transction.

## API call

Use `futoin.evt.gen:*:addEvent` call.

```javascript
GenFace.register(as, ccm, '#evtgen', endpoint );
// ...
const evtgen = ccm.iface('#evtgen');
evtgen.addEvent(as, 'NULL_EVENT');
evtgen.addEvent(as, 'INT_EVENT', 123);
evtgen.addEvent(as, 'STR_EVENT', 'Some Str');
evtgen.addEvent(as, 'ARRAY_EVENT', [1, 2, 3]);
evtgen.addEvent(as, 'OBJECT_EVENT', { a: 1, b: 2, c: 3 });
```

## Transaction query

For more advanced cases, you can check source code of `DBGenFace#addXferEvent()`
to build more tailored statements.

```javascript
DBGenFace.register(as, ccm, '#evtgen', endpoint );
// ...
const evtgen = ccm.iface('#evtgen');
const db = ccm.db();

const xfer = db.newXfer();
xfer.insert('SomeTable').set('name', 'Name');
evtgen.addXferEvent(xfer, 'NEW_ENTRY', {name: 'Name'});
xfer.execute(as);
```

