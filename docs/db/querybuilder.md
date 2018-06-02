---
path: /docs/db/querybuilder/
---

# Database QueryBuilder

## Conditions concept

For conditions optional match operators are supported.
The operator must be added to field name like `field {OP}`.

For example:

```javascript
db.select('users')
    .where('some_field >=', 10)
    .execute(as);
```

The following standard ops are assumed:

* `=` - equal
* `<>` - not equal
* `>` - greater
* `>=` - greater or equal
* `<` - less
* `<=` - less or equal
* `IN` - in array or subquery (assumed)
* `NOT IN` - not in array or subquery (assumed)
* `BETWEEN` - two value tuple is assumed for inclusive range match
* `NOT BETWEEN` - two value tuple is assumed for inverted inclusive range match
* `LIKE` - LIKE match
* `NOT LIKE` - NOT LIKE match
* other ops may be implicitely supported

*Note: `EXISTS`, `ANY` and `SOME` are not supported by design due to known performance issues in many database implementations.*

### Advanced condition builders

Internally, all conditions are represented as array with optional sub-arrays.
It's possible to use this representation directly for very complex cases.

The details are out of scope of this guide.

### Unsafe DML concept

Sometimes developers forget to add conditions to DML statements like delete or update.
QueryBuilder has a built-in safety feature to raise error, unless unsafe DML statement
is explicitly allowed.

## Native QueryBuilder API

* `QueryBuilder clone()`
    * create copy of builder
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
* `QueryBuilder get(field[, value])`
    * `field` - field name
    * `value` - arbitrary value, expression or QueryBuilder sub-query
* `QueryBuilder get(List fields)`
    * `fields` - list of field names to select
* `QueryBuilder get(Map fields)`
    * `fields` - name => expression pairs to select
* `QueryBuilder getInsertID(String field)`
    * `field` - name of field with auto-generated value
* `QueryBuilder newRow()`
    * enables multi-row insert on first call
    * saves current `set()` values into list, if any
* `QueryBuilder set(field[, value])`
    * `field` - string
    * `value` - arbitrary value, expression or QueryBuilder sub-query
* `QueryBuilder set(Map fieldValueMap)`
    * calls `set()` for each pair of `fieldValueMap`
* QueryBuilder set(QueryBuilder select_query)
    * special for "INSERT-SELECT" cases
    * `select_query` field names are used for target field names
* `QueryBuilder where(conditions)`
    * `conditions` - see concept
* `QueryBuilder where(field, value)`
    * handy shorcut for `where({ field: value })`
* `QueryBuilder having(conditions)`
    * `conditions` - see concept
* `QueryBuilder having(field, value)`
    * handy shorcut for `having({ field: value })`
* `QueryBuilder group(field_expr)`
* `QueryBuilder order(field_expr, Boolean ascending=true)`
* `QueryBuilder limit(Integer count, Integer offset)`
* `QueryBuilder join(join_type, entity, conditions)`
    * `join_type` - "INNER", "LEFT"
    * `entity` - see L1.queryBuilder()
    * `conditions` - see concept
* QueryBuilder innerJoin(entity, conditions)
    * shortcut for `join("INNER", entity, conditions)`
* QueryBuilder leftJoin(entity, conditions)
    * shortcut for `join("LEFT", entity, conditions)`
* `void execute(AsyncSteps as, Boolean unsafe_dml=false)`
    * creates query string and calls `query()`
    * `unsafe_dml` - fail on DML query without conditions, if true
* void executeAssoc(AsyncSteps as, Boolean unsafe_dml=false)
    * Same as `execute()`, but process response and passes
        array of maps and amount of affected rows instead.
* `Prepared prepare(Boolean unsafe_dml=false)`
    * Return an interface for efficient execution of built query
        multiple times

## Examples

### 1. Simple queries

```javascript
    const db = ccm.db();
    let q;
    
    // prepare table
    // ---
    db.query(as, 'DROP TABLE IF EXISTS SomeTbl');
    db.query(as, 'CREATE TABLE SomeTbl(' +
            'id int auto_increment primary key,' +
            'name varchar(255) unique)');
    
    // insert some data
    // ---
    // - simple set
    db.insert('SomeTbl').set('name', 'abc').execute(as);
    // - set as object key=>value pairs
    db.insert('SomeTbl').set({name: 'klm'}).execute(as);
    // - set with Map key=>value pairs
    db.insert('SomeTbl')
        .set(new Map([['name', 'xyz']]))
        .getInsertID('id')
        .executeAssoc(as);
    // use insert ID
    as.add((as, res, affected) => console.log(`Insert ID: ${res[0].$id}`));
    
    // INSERT-SELECT like query
    // ---
    // sub-query must be the only parameter for .set()
    db.insert('SomeTbl').set(
        // DANGER: .get() expects expressions and does not escape them!
        db.select('SomeTbl').get('name', "CONCAT('INS', name)").where('id <', 3)
    ).execute(as);
    
    // update data
    const helpers = db.helpers();
    
    q = db.update('SomeTbl')
        // - .set can be called multiple times
        .set('id', 10)
        // - please note that set auto-escapes all values, unless wrapped with .expr()
        .set('name', helpers.expr('CONCAT(id, name)'))
        // - simple condition
        .where('name', 'klm')
        // - extra calls are implicit "AND"
        // - Most powerful array-based definition which is
        //      very close to how all conditions are handled internally.
        .where([
            'OR', // The scope of OR is only children of this array
            // object as member, all fields are AND assumed
            {
                // there are various generic suppported operators
                'name LIKE': 'kl%',
                // another example
                'id >': 1,
            },
            // Inner complex array
            [
                'AND', // this can be omitted as "AND" is implicit for arrays
                // raw expression as string - DANGER of SQLi, please avoid
                'name NOT LIKE \'xy%\'',
                // another example of operator with two values
                { 'id BETWEEN': [1, 10] }
            ],
            // Note: Map object can also be used
        ]);

    // Dump raw query for inspection
    console.log(`Query: ${q}`);
    // UPDATE SomeTbl SET id=10,name=CONCAT(id, name) WHERE name = 'klm' AND (name LIKE 'kl%' OR id > 1 OR (name NOT LIKE 'xy%' AND id BETWEEN 1 AND 10))
    
    // Finally, execute it
    q.execute(as);

    // Select without entity
    // ---
    db.select().get('atm', 'NOW()').executeAssoc(as);
    as.add((as, res) => console.log(`At the moment: ${res[0].atm}`));
    
    // Select with join of result of sub-query (instead of normal table)
    // ---
    q = db.select('SomeTbl')
        .innerJoin(
            // sub-query
            // NOTE: use of .escape() for .get()
            [ db.select().get('addr', helpers.escape('Street 123')), 'Alias'],
            // all where-like conditions are supported here
            '1 = 1' // can be omitted
        );
    console.log(`Query: ${q}`);
    // SELECT * FROM SomeTbl INNER JOIN (SELECT 'Street 123' AS addr) AS Alias ON 1 = 1
    q.executeAssoc(as);
    // inspect result
    as.add((as, res) => console.log(res));
    /*
     * [
     *  { id: 10, name: '10klm', addr: 'Street 123' },
     *  { id: 1, name: 'abc', addr: 'Street 123' },
     *  { id: 4, name: 'INSabc', addr: 'Street 123' },
     *  { id: 5, name: 'INSklm', addr: 'Street 123' },
     *  { id: 3, name: 'xyz', addr: 'Street 123' },
     * ]
     */
```

### 2. Prepared QueryBuider

```javascript
// create a prepared statement with query builder
// ---
const helpers = db.helpers();
const prepared_q = db.insert('SomeTbl')
    // notice .param() placeholder
    .set('name', helpers.param('nm'))
    .getInsertID('id')
    .prepare();

for (let nm of ['abc', 'klm', 'xyz']) {
    // prepared_q is not QueryBuilder, but Prepared object
    prepared_q.executeAssoc(as, {nm});
    as.add((as, res) =>
        console.log(`Inserted ${nm} ID ${res[0].$id}`));
}

// Inserted abc ID 1
// Inserted klm ID 2
// Inserted xyz ID 3
```
