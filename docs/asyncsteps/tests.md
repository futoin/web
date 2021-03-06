---
path: /docs/asyncsteps/tests/
---

# Writing tests with AsyncSteps

## JavaScript (Mocha or similar)

Traditional approach for asynchronous steps:

```javascript
it( 'should ...', function(done) => {
    setTimeout( done, 100 );
} );
```

Writing for AsyncSteps is a bit different as we need to create "thread" and
`execute()` it. It is also desired to dump error code and error info from
`state`, but not only provide pure exception to test runtime.

Fortunately, FutoIn AsyncSteps provides a test case helper:

```javascript
// NOTE: it's not exposed through main entry point
$as_test = require( 'futoin-asyncsteps/testcase' );

// Positive test example
it( 'should ...', $as_test(
    ( as ) => {
        // some test logic
    }
) );

// Negative test example
it( 'should ...', $as_test(
    ( as ) => {
        // some test logic
        // Forced as.error('NegativeTestMustThrow') step in the end
    },
    ( as, err ) => {
        if ( err === 'ExpectedError' ) {
            as.success();
        }
    }
) );

// Access "this" provided by Mocha
it( 'should ...', $as_test(
    function( as ) {
        // note use a full function instead of a light arrow function
        this.timeout( 1e3 );
    }
) );
```

Please note that tests with error handler are assumed to throw an error to pass.
If errors are not thrown then `NegativeTestMustThrow` error is forced.
