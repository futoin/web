---
path: /docs/asyncsteps/first-steps/
---

# First AsyncSteps

By convention, JS version of AsyncSteps module is referred as `$as`.

*Note: there is no "thread" term in the spec - it used only for the guide.*.

## Basic "thread"

Let's start from AsyncSteps "thread" creation:

```javascript
const $as = require( 'futoin-asyncsteps' );
const root_as = $as(); // create "thread"
```

*Note: `$as()` call is syntax sugar for `new AsyncSteps`*

Then, let's add some steps through `.add()` API:

```javascript
root_as.add( (asi) => console.log( 'Hello World!' ) );
```

Finally, let's start the "thread":

```javascript
// only allowed on root instance
root_as.execute(); // start the "thread"
```

The calls above can be chained:

```javascript
$as()
    .add( (asi) => console.log( 'Hello World!' ) )
    .execute();
```

## Steps

"Step" is continuously executed code fragment. Each such step
can add other "inner" steps during execution.

Step is represented by a callable. It must always take `asi` interface
as the first argument. `asi` is a single object to expose all AsyncSteps
features during execution of particular step.

```javascript
asi.add( (asi) => {
    // code fragment
} );
```

## Result passing

The step may take additional parameters. They are populated with explicit
result (`as.success()`) of the previous executed step.

```javascript
asi.add( (asi) => {
    asi.add( (asi) => asi.success( 1, 'a', {} ) );
    asi.add( (asi, n, s, o) => {} );
} );
```

## Thread local storage

A single instance of implementation-defined `state` is created with root
AsyncSteps instance. It must be always accessible through `asi.state`.

```javascript
asi.add( (asi) => {
    asi.add( (asi) => {
        asi.state.some_field = {};
        asi.state.other_field = 123;
    } );
    asi.add( (asi) => {
        console.log( asi.state.some_field );
    } );
} );
```

*Note: please avoid passing generic results through state object!*

## Throwing errors

Expected errors are triggered by `asi.error( error_code[, error_info] )`.
It sets internal state and throws exception to ensure interruption of
current step execution. So, unexpected exceptions also get processed.

Error code must be a string which does not change over software evolution.
String type has been choosen to be easily passable through network.
It can be seen as name of exception class.

Error info must be a string as well. It is saved in `state.error_info`.

Exception thrown is saved in `state.last_exception`.

```javascript
asi.add( (asi) => {
    asi.error( 'ErrorCode', 'Some arbitrary info' );
} );
```

## Error handling

Each step can be accompanied by optional error handler. The step itself 
can be seen as `try {}` block and the error handler as `catch {}` block.

Error handler is set through optional second parameter of `asi.add()`.

Error handler can:

* call `asi.success()` to ignore the error and continue execution,
* call `asi.error()` to override the error,
* call `asi.add()` to make recovery actions and continue execution,
* otherwise, the async stack is unwinded with the original error.

```javascript
asi.add(
    (asi) => call_something( asi ),
    (asi, error_code) => {
        switch ( error_code ) {
        case 'Duplicate':
            as.success(); // ignore
            break;
        case 'Mismatch':
            as.add( (as) => call_other( asi ) ); // recovery
            break;
        case 'SecretError':
            as.error( 'GenericError' );
            break;
        default:
            console.log( as.state.last_exception ); // just observe
            // continue async stack unwinding
        }
    }
);
```

## Semantics error handling & production mode

It's important to use the AsyncSteps interfaces passed to execution or error handler.

Unless `NODE_ENV=production`, AsyncSteps validates handler parameter count and performs
other sanity checks with descriptive error.

If such errors happen in production then most likely there still be a failure, but error
message would be quite cryptic to understand.

