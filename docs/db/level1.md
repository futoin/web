---
path: /docs/db/level1/
---

# Database Level 1

Protocol-level concept is very simple. Most complex logic is
implemented on client side. Therefore, client can be updated to
newer versions without server side changes. Also, there is minimal
processing load on server side.

## Protocol Level API

#### `query(as, q)`

Executes raw query as is. Result has two variables:

1. `rows` is array of field value arrays.
1. `fields` - is array of field names.

Native `associateResult()` function can be used to get array
of field=>value maps.

It is discouraged to use this function directly.
`QueryBuilder` should be used instead.

*Note: the result is packed this way for network size efficiency.*

#### `callStored( as, name, args)`

Call stored procedure. Result is the same as in `query()`.

`Note: not all database engines support this feature.`

#### `getFlavour( as )`

Get database engine type


## Client-only native API

Below is list of additional native interface functions. This level
also provides [QueryBuilder](/docs/db/querybuilder/) and
[Helpers](/docs/db/helpers/) described separately.

* `QueryBuilder queryBuilder(type, entity)`
    * `type` - DELETE, INSERT, SELECT, UPDATE
    * `entity` -
        - table or view name
        - QueryBuilder object to use as sub-query
        - tuple of [entity, alias]
        - null - special case without SQL "FROM"
    * `alias` - alias to use for referencing
* `QueryBuilder delete(entity)`
    * calls `queryBuilder('DELETE', entity)`
* `QueryBuilder insert(entity)`
    * calls `queryBuilder('INSERT', entity)`
* `QueryBuilder select(entity)`
    * calls `queryBuilder('SELECT', entity)`
* `QueryBuilder update(entity)`
    * calls `queryBuilder('UPDATE', entity)`
* `void paramQuery(as, String q, Map params={})`
    * substitute `:name` placeholders in `q` with
        values from `params`.
    * then call normal raw `query()`.
* `Array associateResult(as_result)`
    * process efficiently packed result to get array
        of associative Map
* `Prepared getPrepared(unique_key, callback)`
    * A feature for easy re-using prepared statements
    * checks if prepared statement has been already cached with
        unique key and retuns one if found
    * otherwise, calls callback, stores result and returns it
* `Helpers helpers()`
    * get associated `Helpers` instance

### Prepared satements

Unlike some database engines which allow server-side statement preparation,
this concept assumes preparation of client-side statement in native
database engine format.

Typical benefit is removal of repeated complex Query or Xfer builder logic
processing on each statement. Instead raw parametrized query is used.

Below is interface of `Prepared` statement:

* `class Prepared`:
    * `void execute(AsyncSteps as, params=null)`
        * `params` - name => value pairs for substitution
        * executes already built query with optional parameters
    * `void executeAssoc(AsyncSteps as, params=null)`
        * the same as `execute()`, but return associated result

### Parametrized queries

Usually, such queries are created by builders, but it's also possible to use
custom raw queries with `:name` placeholders for named parameters to be substituted
at execution time. Actual substitution happens on client side.

## Examples

### 1. Raw query with result association

```javascript
const db = ccm.db();
db.query('SELECT * FROM users');
as.add( (as, res) => {
    res = db.associateResult(res);
    
    for ( let r of res ) {
        const { id, first, last } = r;
        // ...
    }
} );
```

### 2. Simple use of QueryBuilder

```javascript
// executeAssoc() calls associateResult() internally
ccm.db().select( 'users' ).executeAssoc( as );
as.add( (as, rows) => {
    for ( let r of rows ) {
        const { id, first, last } = r;
        // ...
    }
} );
```

### 3. Use of prepared statement

The benefit comes when very complex QueryBuilder or XferBuilder logic is used.

```javascript
// Use as unique key defined once
const SYM_PREPARED = Symbol('SYM_PREPARED');
const db = ccm.db();

const pq = db.getPrapared( SYM_PREPARED, (db) => {
    return db.select( 'users' ).prepare();
} );

pq.executeAssoc( as );
as.add( (as, rows) => {
    for ( let r of rows ) {
        const { id, first, last } = r;
        // ...
    }
} );
```
