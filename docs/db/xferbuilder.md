---
path: /docs/db/xferbuilder/
---

# Database Transaction Builder (XferBuilder)

## Query options

* `affected` - if set, then affected rows are checked:
    - Boolean - true or false means either there are affected rows or no affected rows respectively.
    - Integer - result must have exact number of affected rows.
* `selected` - if set, then selected rows are checked:
    - Boolean - true or false means either there are selected rows or no selected rows respectively.
    - Integer - result must have exact number of selected rows.
* `return` - if explicit true then result has to be returned on protocol level.

## Transaction value back references

Very often, transaction requires values returning from previous queries
inside the same transaction. As overall concept forbids
transaction processing splitting across requests a special mechanism
of placeholders for value back references is required.

1. There are database-specific placeholder format which are emdedded
    in raw query strings when run through L2 xfer() API.
2. Placeholders is:
    * reference to previous query results by sequential ID,
    * mark single or multiple value mode (use first or all result rows),
    * reference particular field by name,
    * must be impossible sequence for embedded strings - use string quotes.
3. An extra query option for template processing must be supported.
4. If template processing is enabled, the placeholders must be replaced
    with actual values from previous queries.

## Native XferBuilder API

* `XferBuilder clone()`
* `Expression escape(value)`
    * shorcut for `helpers().escape(value)`
* `Expression identifier(name)`
    * shorcut for `helpers().identifier(name)`
* `Expression expr(expr)`
    * shorcut for `helpers().expr(expr)`
* `Expression param(name)`
    * `name` - parameter name
    * wrapped placeholder for prepared statement
* `Helpers helpers()`
    * Get additional helpers which may not be implemented for all database types
* `L2Face lface()`
    * Get associated L2 interface implementation for easy sub-query building
        without use of backref() approach
* `XferQueryBuilder delete(String entity, QueryOptions query_options)`
* `XferQueryBuilder insert(String entity, QueryOptions query_options)`
* `XferQueryBuilder update(String entity, QueryOptions query_options)`
* `XferQueryBuilder select(String entity, QueryOptions query_options)`
* `void call(String name, Array arguments=[], QueryOptions query_options={})`
* `void raw(String q, Map params={}, QueryOptions query_options={})`
* `void execute(AsyncSteps as, Boolean unsafe_dml=false)`
    * build all queries and execute in single transaction
    * `unsafe_dml` - fail on DML query without conditions, if true
    * it must silently allow empty query list
* `void executeAssoc(AsyncSteps as, Boolean unsafe_dml=false)`
    * Same as `execute()`, but process response and passes
        array of maps and amount of affected rows instead.
* `Prepared prepare(Boolean unsafe_dml=false)`
    * Return an interface for efficient execution of built transaction
        multiple times

## Native XferQueryBuilder API

`XferQueryBuilder` extends `QueryBuilder`.

* `void execute(AsyncSteps as, Boolean unsafe_dml=false)`
    - must unconditionally throw InternalError
* `XferQueryBuilder clone()`
    - must unconditionally throw InternalError
* `Expression backref(XferQueryBuilder xqb, field, multi=false)`
    * `xqb` - Query Builder of previous query in transaction
    * `field` - fieldname to use
    * `multi` - require single or multi row result
    * Current query gets marked for template processing
* `XferQueryBuilder forUpdate()`
    * select in "for update" exclusive locking
* `XferQueryBuilder forSharedRead()`
    * select in shared read locking

## Examples

### 1. Simple Transaction Builder

```javascript
// create a transaction with builder
// ---
const xfer = db.newXfer(); // Read Committed by default

// already known QueryBuilder without execute() call
xfer.insert('SomeTbl').set('name', 'abc');
xfer.insert('SomeTbl').set('name', 'xyz');

// Note the the "result" option to include result in
// overall xfer result
xfer.select('SomeTbl', {result: true})
    .get('C', 'COUNT(*)')
    // add FOR-clause, if supported by DB
    .forUpdate();

// Return result of update and check that any rows are affected
xfer.update('SomeTbl', {result: true, affected: true})
    .set('name', 'klm').where('name', 'xyz');
    
// Run again making sure zero rows are affected
xfer.update('SomeTbl', {affected: 0})
    .set('name', 'klm').where('name', 'xyz');

// Execute of transaction itself
xfer.executeAssoc(as);

as.add((as, results) => {
    console.log(`Count: ${results[0].rows[0].C}`);
    console.log(`First UPDATE affected: ${results[1].affected}`);
});

// Count: 2
// First UPDATE affected: 1
```

### 2. Prepared Transaction Builder

```javascript
// create a prepared transaction with builder
// ---
const xfer = db.newXfer(); // Read Committed by default

// already known QueryBuilder without execute() call
xfer.insert('SomeTbl').set('name', xfer.param('n1'));
xfer.insert('SomeTbl').set('name', xfer.param('n2'));

// Note the the "result" option to include result in
// overall xfer result
xfer.select('SomeTbl', {result: true})
    .get('C', 'COUNT(*)')
    .forSharedRead(); // another locking example

// Prepare transaction
const prepared_xfer = xfer.prepare();

// test data
const data = [
    { n1: 'abc', n2: 'xyz' },
    { n1: 'cba', n2: 'zyx' },
];
data.forEach((params, i) => {
    // Efficiently execute prepared transaction
    prepared_xfer.executeAssoc(as, params);

    as.add((as, results) => {
        console.log(`Count for ${i}: ${results[0].rows[0].C}`);
    });
});

// Count for 0: 2
// Count for 1: 4
```

### 3. Advanced Transaction Builder (prepared with back references)

```javascript
// create a prepared transaction with value back references
// ---
const xfer = db.newXfer(db.SERIALIZABLE);

// Insert some parametrized data
const ins1_q = xfer.insert('SomeTbl')
    .set('name', xfer.param('n1'))
    .getInsertID('id');
const ins2_q = xfer.insert('SomeTbl')
    .set('name', xfer.param('n2'))
    .getInsertID('id');

// Ensure two items are selected with brain-damaged conditions
const sel_q = xfer.select('SomeTbl', {selected: 2});
sel_q
    .get('id')
    .where([
        'OR',
        {'name': xfer.param('n1')},
        'id = ' + sel_q.backref(ins2_q, '$id'), // note object of .backref()
    ])
    .forUpdate();
    
// Make sure one row is updated with brain-damaged conditions
const upd_q = xfer.update('SomeTbl', {affected: 1});
upd_q
    .set('name',
            upd_q.expr(`CONCAT('klm', ${upd_q.backref(ins1_q, '$id')})`))
    .where('id IN', upd_q.backref(sel_q, 'id', true))
    .where('name', xfer.param('n1'));

// Prepare transaction
const prepared_xfer = xfer.prepare();

// test data
// ---
const data = [
    { n1: 'abc', n2: 'xyz' },
    { n1: 'cba', n2: 'zyx' },
];
data.forEach((params, i) => {
    // Efficiently execute prepared transaction
    prepared_xfer.executeAssoc(as, params);
});

// Let's see what we have
// ---
db.select('SomeTbl').executeAssoc(as);
as.add((as, res) => console.log(res));

// [ { id: 1, name: 'klm1' },
//   { id: 3, name: 'klm3' },
//   { id: 2, name: 'xyz' },
//   { id: 4, name: 'zyx' } ]
```
