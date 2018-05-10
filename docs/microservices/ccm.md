---
path: /docs/microservices/ccm/
---

# Connection & Credentials Manager

CCM is the core of any FutoIn application. It is a single place to:

1. Register named API endpoints.
1. Associate security credentials with the endpoints.
1. Enforce performance limits per endpoint.
1. Maintain efficient persistent channels.
1. Process timeouts and retries.

CCM is the FutoIn way of IoC (Inversion of Control) / DI (Dependency Injection).

More details can be found in [FTN7: FutoIn Invoker Concept][FTN7].

## API endpoint

Each API endpoint has a unique CCM-wide name.
*Note that a single app may have more than one CCM instance.*

The endpoint can be:

* In-process - Executor instance AS-IS.
* `http://` and `https://` - according to [FTN5: FutoIn HTTP integration][FTN5] (see [Interfaces / HTTP](/docs/ifaces/http/)).
* `ws://` and `wss://` - raw messages over WebSockets.
* `browser://` - in-browser cross-page/cross-frame HTTP5 Web Message communication.
* `unix://` - raw messages over UNIX datagram socket.
* `tcp://` - length-prefixed raw messages over TCP stream.
* `sctp://` - raw messages over SCTP datagram connection.

## Security credentials

There are two basic approaches for message signing: simple secret and message authentication code.

Simple secret is similar to HTTP Basic Authentication - a user:password pair.

Message Authentication Code is much more advanced - it protects shared secret from exposure and ensures
message integrity.

The shared secret can be static (legacy mode) or dynamic (periodic rotation based on FTN8 Security Concept).
The later requires local Secure Vault and key exchange processing.

## Examples

*Note: each implementation of Invoker CCM has own documentation. It should be used for reference.*

Below is a simple case from JS implementation:

```javascript
const $as = require( 'futoin-asyncsteps' );
const invoker = require( 'futoin-invoker' );

// Run in AsyncSteps thread
$as()
    // Once-only initialization
    .add((asi) => {
        // 1. Create CCM instance
        const ccm = new invoker.AdvancedCCM({
            specDirs : [ __dirname + '/specs' ]
        });
        
        // 2. Register API endpoint
        ccm.register(
            asi,
            'somename',
            'some.iface:1.0',
            'https://localhost/some/path'
        );
    })
    // Regular runtime code
    .loop((asi) => {
        // Get NativeIface reference.
        const someface = ccm.iface('somename');
        
        // Use like ordinary object.
        someface.somefunc(asi, 1, 'abc', true);
        
        asi.add((asi, res) => {
            // handle async result
            console.log(res.var1, res.var2);
        });
        
        // Note this code is run before the step above.
        someface.otherfunc(asi);
        someface.anotherfunc(asi);
    })
    .execute();
```

As you can see, calling remote FutoIn Services is as simple as calling a local function.

[FTN5]: https://specs.futoin.org/final/preview/ftn5_iface_http_integration.html
[FTN7]: https://specs.futoin.org/final/preview/ftn7_iface_invoker_concept.html
