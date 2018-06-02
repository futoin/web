---
path: /docs/db/helpers/
---

# Database Helpers

This API semantically fits neither database interface nor any of builders.

In most cases Helpers provide engine-specific raw expressions and/or conversions
to native client types.

Not all API may be available in all database engines.

## Expression API

* `Expression now()`
    * Return expression representing current timestamp
* `Expression date(NativeTimestamp value)`
    * Convert implementation-defined native timestamp to DB-specific
        string representation
* `Expression dateModify(Expression expr, Integer +/-seconds)`
    * Return expression representing source date/time expression
        being applied with `seconds` interval implementation-defined
        way
* `String escape(value)`
    * `value` - any value, including QueryBuilder instance
* `String identifier(name)`
    * `name` - string to escape as identifier
* `Expression expr(expr)`
    * `expr` - raw expression
    * wrap raw expression to avoid escaping as value
* `Expression concat(args...)`
    * Return expression of argument concatenation
* `Expression cast(a, type)`
    * Return a cast to type expression
* `Expression add(a...)`
    * Return addition expression
* `Expression sub(a, b)`
    * Return subtraction expression
* `Expression mul(a...)`
    * Return multiplication expression
* `Expression div(a, b)`
    * Return division expression
* `Expression mod(a, b)`
    * Return reminder expression
* `Expression least(a...)`
    * Return minimal of arguments expression
* `Expression greatest(a...)`
    * Return maximal of arguments expression
* any other - implementation is free to add any other meaningful helpers

## Conversion API

* `NativeTimestamp nativeDate(String value)`
    * Get implementation-defined timestamp from string representation
        of date / datetime object

        
