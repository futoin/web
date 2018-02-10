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

Writing for AsyncSteps is a bit different as we need to create "thread",
execute it. It is also desired to dump error code and error info from
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
        // note use a full function, instead a light arrow function
        this.timeout( 1e3 );
    }
) );
```
