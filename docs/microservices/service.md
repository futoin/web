---
path: /docs/microservices/service/
---

# FutoIn Service

The major idea of FutoIn **Service** is to avoid any external code
dependencies as much as possible to minimize maintenance required
due to dependency updates over time.

Therefore, FutoIn **Service** is represented by a single class per **Iface** spec.
The class should have member functions named after corresponding definitions
in the spec.

The only input parameters of such functions are:

1. `asi` - AsyncSteps interface as described in [FutoIn AsyncSteps](/docs/asyncsteps/).
1. `request_info` - an all-in-one request information object.

All calls to other services must be made through CCM instance accessible
through `request_info.ccm()`. A pure FutoIn Service must not have any configuration as
all external endpoints must be configured through the CCM instance.

Service function is called by executor only after all required checks are done.
The [async] result of Service function execution is also checked for validity.

## `RequestInfo` native interface

RequestInfo instance is the only object holding any details of the request.

Typically, request info provides access to the following details:

1. `params()` - input parameters.
1. `result()` - output parameters.
    - `result(replacement)` - to replace parameter map or set single value result.
1. `info()` - raw details.
1. `rawInput()` - input stream for raw request calls.
1. `rawOutput()` - output stream for raw response calls.
1. `executor()` - reference to Executor instance (may change over Service lifetime).
1. `ccm()` - shortcut for `executor().ccm()`.
1. `channel()` - reference to communication channel context.
1. `cancelAfter(timeout_ms)` - override default request processing timeout.
1. `userInfo()` - shortcut for `info()[USER_INFO]`.

*Note: specific Executor implementation may have additional native API for request info.*

## `UserInfo` native interface

This is user information retrieval interface with the following member functions:

1. `string localID()` - short internal system ID (usually a Base64 coded UUID without padding).
1. `string globalID()` - globally unique associative identifier (typically in form of email or similar).
1. `details(AsyncSteps, user_field_identifiers[])` - retrieval of additional information which is not feasible
   to retrieve for each request.

## `ChannelContext` native interface

The most abstract interface which is very specific to communication channel type.

The list of basic API:

1. `type()` - type identification like `HTTP`, `WS`, `BROWSER`, etc.
1. `isStateful()` - true if `state()` is maintained between calls through the same connection.
1. `state()` - similar to `AsyncSteps#state()`, but for communication channel.
1. `onInvokerAbort(callable, [user_data])` - possibility to register request abort handler.
1. `register(asi, ifacever, options )` - counterpart of `CCM#register()` to make callbacks through
   the established `BiDirectional` channel.
1. `iface(ifacever)` - counterpart of `CCM#iface()`

Other native API may be available depending on implementation.

## Adapter services

Real world cases require interaction with non-FutoIn functionality. It's assumed that
such functionality is provided through adapter services which use third-party
libraries/frameworks and support implementation-defined configuration.

If external functionality can be represented in FutoIn spec (e.g. HTTP REST, CORBA, RPC, etc.)
then it's possible to support on-the-fly conversion of third-party API specification to FutoIn
with special adapter services.

Otherwise, if such bold conversion is not feasible (e.g. SQL) then custom made adapter services
can be implemented. For example: [futoin-database](/docs/db/).

## Examples:

Interface definition `org.example.myservice-1.0-iface.json`:

```json
{
    "iface" : "org.example.myservice",
    "version" : "1.0",
    "ftn3rev" : "1.9",
    "funcs" : {
        "simpleResult" : {
            "result" : {
                "some_var" : "string",
                "another_var" : "integer"
            }
        },
        "dbInsert" : {
            "params" : {
                "name" : "string",
                "d" : "integer"
            }
        }
    },
    "requires" : [
        "AllowAnonymous"
    ],
    "desc" : "MyService example"
}
 
```

Service code:

```javascript
class MyService {
    simpleResult(asi, request_info) {
        asi.success({
            some_var: 'some value',
            another_var: 123,
        });
    }
    
    dbInsert(asi, request_info) {
        const p = request_info.params();
        const db = request_info.ccm().db();

        db
            .insert('some_table')
            .set(p)
            .getInsertID('id_field')
            .executeAssoc(asi);
            
        as.add( (asi, {rows}) => {
            request_info.result(rows[0].$id);
        });
    }
}
```
