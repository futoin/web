---
path: /docs/miscjs/asyncsteps-request/
---

# JS: futoin-request

FutoIn AsyncSteps friendly wrapper of [request](https://www.npmjs.com/package/request).

* [GitHub](https://github.com/futoin/util-js-request)
* [GitLab](https://gitlab.com/futoin/util/js/request)
* [npmjs](https://www.npmjs.com/package/futoin-request)

## Usage

```javascript
const $as = require('futoin-asyncsteps');
const $as_request = require('futoin-request');

$as().add((as) => {
    // Very basic
    $as_request(as, 'https://httpbin.org/get');
    as.add((as, rsp, body) => console.log(body));
    
    // As usual
    $as_request.post(as, {
        url: 'https://httpbin.org/post',
        json: {a: 1, b: 2},
    });
    as.add((as, rsp, body) => console.log(body));
    
    // With callback for request as stream manipulation
    $as_request.post(as, {
        url: 'https://httpbin.org/post',
        headers: { 'content-length': 4 },
    }, (req) => req.end('test') );
    as.add((as, rsp, body) => console.log(body));    
}).execute();
```

## API notes

API is absolutely the same as for original request package except that:

1. The first parameter must be a reference of AsyncSteps interface type.
2. A next step receiving `(as, rsp, body) => {}` must be added instead of result callback.
3. Error is thrown through `AsyncSteps#error()`, if detected.
4. HTTP status != 200 is error as well.
5. Request object is not returned, but passed to optional callback (third argument).

Additional notes:
* Request is properly canceled on `AsyncSteps#cancel()` or timeout
* Error info details
    - error type - `RequestError`
    - error object should be available through standard `as.state.last_exception` convention
    - `as.state.last_response` is set with response object
* Browser provides `$as_request` global reference
