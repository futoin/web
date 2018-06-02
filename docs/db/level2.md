---
path: /docs/db/level2/
---

# Database Level 2

This level is focused on transactions. It inherits all features of Level 1.

As with Level 1, API is separated into simple protocol-level API and advanced
client-side API.

## Protocol Level API

### `xfer(as, ql, isol)`

**Avoid using this API directly!**

It is described only for reference purposes.

* `ql` array of queries:
    * `q` - raw query
    * `affected` - optional integer or boolean to check affected rows
    * `selected` - optional integer or boolean to check affected rows
    * `result` - if true, query result is returned
    * `template` - if true, template backreferences are processed
* `isol` is one of isolation levels:
    * "RU" - read uncommitted
    * "RC" - read committed
    * "RR" - repeatable read
    * "SRL" - serialiazable

Result is array of objects with `seq`, `rows`, `fields` and `affected` rows.
`seq` is sequence number of original query in transaction batch. The rest of
variables have the same meaning as in ordinary query.

## Client-side native API

* `XferBuilder newXfer(IsolationLevel isol="RC")`
    - Create new associated `XferBuilder` with specified isolation level.

## Examples

```javascript
const db = ccm.db();
const xfer = db.newXfer();
xfer.insert('users', {affected: 1}).set({ first: 'First', last: 'Last'});
xfer.select('users', {result: true});
xfer.executeAssoc( as );
as.add( (as, res) => {
    for ( let r of res[0] ) {
        const { id, first, last } = r;
        // ...
    }
} );
```
