---
path: /docs/microservices/ccm/
---

# Invoker Connection & Credentials Manager

CCM is the FutoIn way of IoC (Inversion of Control) / DI (Dependency Injection).
It is the core of any FutoIn application with a single place for:

1. Registration of named API endpoints.
1. Association of security credentials with the endpoints.
1. Enforcing throttling per endpoint.
1. Maintaining efficient persistent communication channels.
1. Processing timeouts and retries.

Original specification can be found at [FTN7: FutoIn Invoker Concept][FTN7].

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

## Endpoint names

The names are absolutely arbitrary strings. However, names starting with
symbol '#' are reserved for internal use by standard FutoIn specs.

## Security credentials

There are two basic approaches for message signing: simple secret and message authentication code.

Simple secret is similar to HTTP Basic Authentication - a `user:password` pair.

Message Authentication Code is much more advanced - it protects shared secret from exposure and ensures
message integrity.

The shared secret can be static (legacy mode) or dynamic (periodic rotation based on FTN8 Security Concept).
The later requires local Secure Vault and key exchange processing.

More in-depth details to be provided in a dedicated section for FutoIn Security Concept.

## Request throttling

As every public Executor imposes limits on API requests, the typical CCM would constantly hit
the limits with failure responses unless it throttles own requests by itself. Failure to do that
may lead excessive network traffic and system load or blacklisting by defense system.

Therefore, each external endpoint is throttled based on default Executor limits by default.
Internal endpoints are not throttled by default.

Please check `CCM#limitZone()` and endpoint `limitZone` for advanced configuration.


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

## Standard native CCM API

The native API has the following standard members.

Simple CCM:

1. `event 'register' ( name, ifacever, rawinfo )` - when new interface get registered
1. `event 'unregister' ( name, rawinfo )` - when interface get unregistered
1. `event 'close'` - when CCM is shutdown
1. `void register( AsyncSteps as, name, ifacever, endpoint [, credentials [, options] ] )`
    * register standard MasterService end-point (adds steps to *as*)
    * *as* - AsyncSteps instance as registration may be waiting for external resources
    * *name* - unique identifier in scope of CCM instance
    * *ifacever* - iface identifier and its version separated by colon, see note below
    * *endpoint* - URI or any other resource identifier of iface implementing peer, accepted by CCM implementation
    * "credentials* - optional, authentication credentials (string)
        * 'master' - enable MasterService authentication logic (Advanced CCM only)
        * '{user}:{clear-text-password}' - send as is in the 'sec' section
        * '-hmac:{user}' - HMAC generation, see *options.hmacKey* and *options.hmacAlgo* for details
        * '-internal' - for internal communication channel with SL_SYSTEM auth level
        * NOTE: some more reserved words and/or patterns can appear in the future
    * *options* - optional, override global options of CCM
1. `NativeIface iface( name )`
    * Get native interface wrapper for invocation of iface methods
    * *name* - see register()
    * Note: it can have template/generic counterpart like iface<NativeImpl>() for strict type languages
1. `void unRegister( name )`
    * unregister previously registered interface (should not be used, unless really needed)
    * *name* - see register()
1. `NativeLogIface log()` - returns native API interface as defined in [FTN9 IF AuditLogService][]
1. `NativeCacheIface cache( [bucket="default"] )` - returns native API interface for Cache as defined in [FTN14 Cache][]
1. `void assertIface( name, ifacever )`
    * Assert that interface registered by name matches major version and minor is not less than required.
    * This function must generate fatal error and forbid any further execution
    * *name* - see register()
    * *ifacever* - required interface and its version
1. `void alias( name, alias )`
    * Alias interface name with another name
    * *name* - as provided in register()
    * *alias* - register alias for *name*
1. `void close()`
    * Shutdown CCM processing
1. `void limitZone( name, options )`
    * configure named AsyncSteps v1.10 `Limiter` object to use for request throttling

Advanced CCM extensions:

1. `void initFromCache( AsyncSteps as, cache_l1_endpoint )`
    * *cache_l1_endpoint* - end-point URL for Cache L1
    * as.success(), if successfully initialized from cache (no need to register interfaces)
    * Note: Cache L1 needs to be registered first
1. `void cacheInit( AsyncSteps as )`
    * call after all registrations are done to cache them

### Endpoint options

* `specDirs` - Search dirs for spec definition or spec instance directly
* `executor` - pass client-side executor for bi-directional communication channels
* `targetOrigin` - browser-only. Origin of target for *window.postMessage()*
* `retryCount=1` - how many times to retry the call on CommError
* `callTimeoutMS` - Overall call timeout (int)
* `nativeImpl` - Native iface implementation class
* `hmacKey` - Base64-encoded key for HMAC
* `hmacAlgo` - one of pre-defined or custom hash algorithms for use with HMAC
* `sendOnBehalfOf=true` - control, if on-behalf-of field should be sent with user information
    when interface is used from Executor's request processing task
* `limitZone=default`` - name of limit zone to use for invoker requests

[FTN5]: https://specs.futoin.org/final/preview/ftn5_iface_http_integration.html
[FTN7]: https://specs.futoin.org/final/preview/ftn7_iface_invoker_concept.html
[FTN9 IF AuditLogService]: https://specs.futoin.org/final/preview/ftn9_if_auditlog.html
[FTN14 Cache]: https://specs.futoin.org/final/preview/ftn14_cache.html
[FTN15 Native Event]: https://specs.futoin.org/final/preview/ftn15_native_event.html
