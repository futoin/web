---
path: /docs/asyncsteps/
---

# AsyncSteps intro

**FutoIn AsyncSteps** is a response to a demand for a generic concept of asynchronous
program flow coding in a way which closely mimics traditional synchronous threads.

It's the essential part which allows safe transfer of complex financial logic to
scalable asynchronous runtime.

The concept is clearly different from trivial [Promise][], [async/await][await] or
generic [coroutines][], but **it matches those in speed**.
FutoIn AsyncSteps concept was born when neither of those were standardized. Also, it
is assumed to be implementable in bare metal languages like C++.

Overall features & goals:

* Mimic "thread of execution":
    - allow cancelling from outside,
    - cancel by timeout as standard feature,
    - "atexit"-like cleanup actions.
* Mimic "try-catch":
    - clear scoping of inner blocks,
    - mimic "stack unwinding" on errors and cancels,
    - RAII-like cleanup on async stack unwinding,
    - support recovery actions in `catch`.
* Mimic "worker pool":
    - parallel execution of steps,
    - early cancel on error.
* Mimic "thread local storage":
    - per-instance `state`,
    - also shared within worker pool.
* Mimic synchronization primitives:
    - `Mutex` - limit number concurrent "threads" in critical section,
    - `Throttle` - limit number of critical section entries in period,
    - `Limiter` - merge of `Mutex` and `Throttle`.
* Support loops:
    - generic `loop` with `continue` and `break`,
    - `repeat` for specified number of times,
    - `foreach` over array or object.
* Cross-technology exceptions and error info:
    - assumed to be passed over network,
    - error code - persistent string,
    - error info - arbitrary string.
* Integration with any external async wait approach:
    - including regular callbacks, `Promise` and `await`,
    - support timeouts & cleanup handlers out-of-box.
* Chain passing of "result->input" sequences:
    - explicit `as.success()` arguments are passed to the next step.
* Integration with implementation-specific Futures and Promises:
    - acts as a regular step

## Specification

[FTN12: FutoIn Async API][FTN12] is a single AsyncSteps specification.

## Reference Implementations

* JS:
    - [GitHub](https://github.com/futoin/core-js-ri-asyncsteps)
    - [GitLab](https://gitlab.com/futoin/core/js/ri-asyncsteps)
    - [npmjs](https://www.npmjs.com/package/futoin-asyncsteps)
* PHP:
    - [GitHub](https://github.com/futoin/core-php-ri-asyncsteps) 
    - [GitLab](https://gitlab.com/futoin/core/php/ri-asyncsteps)
    - [Packagist](https://packagist.org/packages/futoin/core-php-ri-asyncsteps)


[FTN12]: https://specs.futoin.org/final/preview/ftn12_async_api.html
[Promise]: https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
[await]: https://tc39.github.io/ecma262/#sec-async-function-definitions
[coroutines]: http://www.boost.org/doc/libs/1_66_0/libs/coroutine/doc/html/coroutine/intro.html
