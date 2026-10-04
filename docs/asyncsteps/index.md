---
path: /docs/asyncsteps/
description: FutoIn AsyncSteps is a concept of asynchronous program flow coding in a way which closely mimics traditional synchronous threads.
keywords: futoin asyncsteps
---

# AsyncSteps intro

**FutoIn AsyncSteps** is a concept of asynchronous program flow coding in a way
which closely mimics traditional synchronous threads.

The concept is clearly different from trivial [Promise][], [async/await][await],
or generic [coroutines][], but **it matches and exceeds those in speed**. In
fact, it has a much lower theoretical flow switching overhead than required by
bare metal coroutines with full register file dump & restore plus other
maintenance work.

The FutoIn AsyncSteps concept was born when none of those were standardized.
Also, it is implemented in bare metal languages like C++ and supports an ISO
C11 binary interface. It's the essential part which allows safe transfer of
complex financial business logic to a scalable asynchronous runtime.

Overall features & goals:

* Mimic "thread of execution":
    - allow cancelling from outside,
    - cancel by timeout as a standard feature,
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
    - `Mutex` - limit number of concurrent "threads" in critical section,
    - `Throttle` - limit number of critical section entries in period,
    - `Limiter` - merge of `Mutex` and `Throttle`.
* Support loops:
    - generic `loop` with `continue` and `break` using optional labels,
    - `repeat` for specified number of times,
    - `foreach` over arrays, objects, sequences, and iterators.
* Cross-technology exceptions and error info:
    - assumed to be passed over network,
    - error code - persistent string code,
    - error info - arbitrary human-readable string.
* Integration with any external async wait approach:
    - including regular callbacks, `Promise`, and `await`,
    - support timeouts & cleanup handlers out-of-the-box.
* Chain passing of "result->input" sequences:
    - explicit `as.success()` arguments are passed to the next step.
* Integration with implementation-specific Futures and Promises:
    - acts as a regular step.
* Memory Pool management for non-GC technologies:
    - allows fine control of memory limits per event loop instance,
    - removes heap synchronization overhead with around 30% boost in tests.
* Designed for integration into foreign event loops and input/output
  reactors.

## Specification

[FTN12: FutoIn Async API][FTN12] is a single AsyncSteps specification.

## Reference Implementations

* C++:
    - FutoIn Core C++ API:
        - [Codeberg: FutoIn Core C++ API](https://codeberg.org/futoin/core-cpp-api)
        - [GitHub: FutoIn Core C++ API](https://github.com/futoin/core-cpp-api)
        - [GitLab: FutoIn Core C++ API](https://gitlab.com/futoin/core/cpp/api)
    - FutoIn Core C++ Reference Implementation with submodules:
        - [Codeberg: FutoIn Core C++ RI](https://codeberg.org/futoin/core-cpp-ri)
        - [GitHub: FutoIn Core C++ RI](https://github.com/futoin/core-cpp-ri)
        - [GitLab: FutoIn Core C++ RI](https://gitlab.com/futoin/core/cpp/ri)
    - FutoIn Core C++ AsyncSteps Reference Implementation:
        - [Codeberg: FutoIn C++ AsyncSteps](https://codeberg.org/futoin/core-cpp-ri-asyncsteps)
        - [GitHub: FutoIn C++ AsyncSteps](https://github.com/futoin/core-cpp-ri-asyncsteps)
        - [GitLab: FutoIn C++ AsyncSteps](https://gitlab.com/futoin/core/cpp/ri-asyncsteps)

* Java:
    - FutoIn Core Java API:
        - [Codeberg: FutoIn Core Java API](https://codeberg.org/futoin/core-java-api)
        - [GitHub: FutoIn Core Java API](https://github.com/futoin/core-java-api)
        - [GitLab: FutoIn Core Java API](https://gitlab.com/futoin/core/java/api)
    - FutoIn Core Java Reference Implementation:
        - [Codeberg: FutoIn Core Java RI](https://codeberg.org/futoin/core-java-ri)
        - [GitHub: FutoIn Core Java RI](https://github.com/futoin/core-java-ri)
        - [GitLab: FutoIn Core Java RI](https://gitlab.com/futoin/core/java/ri)

* JavaScript:
    - [GitHub](https://github.com/futoin/core-js-ri-asyncsteps)
    - [GitLab](https://gitlab.com/futoin/core/js/ri-asyncsteps)
    - [npmjs](https://www.npmjs.com/package/futoin-asyncsteps)

* PHP (**a decade outdated**):
    - [GitHub](https://github.com/futoin/core-php-ri-asyncsteps)
    - [GitLab](https://gitlab.com/futoin/core/php/ri-asyncsteps)
    - [Packagist](https://packagist.org/packages/futoin/core-php-ri-asyncsteps)

[FTN12]: https://specs.futoin.org/final/preview/ftn12_async_api.html
[Promise]: https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
[await]: https://tc39.github.io/ecma262/#sec-async-function-definitions
[coroutines]: http://www.boost.org/doc/libs/1_66_0/libs/coroutine/doc/html/coroutine/intro.html