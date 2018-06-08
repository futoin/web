---
path: /docs/asyncsteps/interop/
---

# AsyncSteps interoperability with other async implementations

Please read [timeout & cancel](/docs/asyncsteps/cancel/) first as
`asi.setTimeout()`, `asi.setCancel()` and `asi.waitExternal()` are
used to signal AsyncSteps to disable implicit `asi.success()` call
and wait for external event completion.

## Generic approach

Please note that callbacks from external functionality are NOT called
through AsyncSteps. Therefore, we have to:

1. Check that related AsyncSteps instance is still running.
2. Catch and discard errors thrown by `asi.error()` to avoid unhandled
    exception warnings.
3. Explicitely call `asi.success()`.

```javascript
asi.add( (asi) => {
    asi.waitExternal(); // disable implicit success()
    
    some_obj.read( (err, data) => {
        if (!asi.state) {
            // ignore as AsyncSteps execution got canceled
        } else if (err) {
            try {
                asi.error( 'IOError', err );
            } catch (_) {
                // ignore error thrown as there are no
                // AsyncSteps frames on stack.
            }
        } else {
            asi.success( data );
        }
    } );
} );
```

## Time limit

```javascript
asi.add( (asi) => {
    asi.setTimeout( 10e3 ); // also disables implicit success
    
    some_obj.read( (err, data) => {
        // ... same as in the generic example
    } );
} );
```

## Cancellation callback

In many cases, we want to disable external processing ASAP, if
we going to discard its result any way.

```javascript
asi.add( (asi) => {
    const req = some_obj.read( (err, data) => {
        // ... same as in the generic example
    } );
    
    // Make sure to cancel read on error or cancel.
    // Also disables implicit success.
    this.setCancel( (asi) => some_obj.cancelReq( req ) );
} );
```

## ES6 Promise interoperation

Since FTN12 v1.11, it's very easy to add Promise or `async` function
call as one of steps.

Since FTN12 v1.12, it's also possible to use AsyncSteps as Promise by
using `#promise()` instead of `#execute()`.

```javascript
$as
    .add((asi) => {
        // await Promise
        as.await(
            new Promise( ... ),
            (as, reason) => {
                // handle rejection reason
            }
        );
        // Normal Step
        as.add( ( asi, result ) => {
            // next step with resolved result
            as.success( result );
        } );
    })
    // Wrap in Promise
    .promise()
        .then((result) => {}, (error) => {} );
```

## Additional notes

It's allowed and encouraged to use both `asi.setTimeout()` and
`asi.setCancel()` when external event processing is used to make
sure that external event has some time limit and that external
processing is correctly aborted.

It's recommended to wrap external event processing in libraries
to make the code cleaner and more safe.

Example: [futoin-request](https://www.npmjs.com/package/futoin-request)
