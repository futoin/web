---
path: /docs/asyncsteps/api/
---

# AsyncSteps API reference

This is excerpt from [FTN12 v1.10](https://specs.futoin.org/final/preview/ftn12_async_api-1.10.html) AS IS.

## 2.1. Types

* `void execute_callback( AsyncSteps as[, previous_success_args] )`
    * first argument is always AsyncSteps object
    * other arguments come from the previous as.success() call, if any
    * returns nothing
    * behavior:
        * either set completion status through `as.success()` or `as.error()`
        * or add sub-steps through `as.add()` and/or `as.parallel()`
        * Optionally, set set time limit through `as.setTimeout()` and/or
            set cancel handler through `as.setCancel()`
        * any violation is reported as `as.error( InternalError )`. Not
            applicable to implicit success.
    * can use `as.state()` for global current job state data
* `void error_callback( AsyncSteps as, error )`
    * the first argument is always AsyncSteps object
    * the second argument comes from the previous `as.error()` call
    * returns nothing
    * behavior, completes through:
        * `as.success()` - continue execution from the next step, after return
        * `as.error()` - change error string
        * return - continue unwinding error handler stack
        * any violation is reported as `as.error( InternalError )`
    * can use as.state() for global current job state data
* `void cancel_callback( AsyncSteps as )`
    * it must be used to cancel out of AsyncSteps program flow actions, like
        waiting on connection, timer, dedicated task, etc.
* `interface ISync`
    * `void sync( AsyncSteps, execute_callback[, error_callback] )`
        * synchronized independent or parallel AsyncSteps, execute provided
            callbacks in critical section.

    
## 2.2. Functions

It is assumed that all functions in this section are part of **single AsyncSteps interface**.
However, they are grouped by semantical scope of use.

### 2.2.1. Common API - can be used in any context

1. `AsyncSteps add( execute_callback func[, error_callback onerror] )`
    * add step, executor callback gets async interface as parameter
    * can be called multiple times to add sub-steps of the same level (sequential execution)
    * steps are queued in the same execution level (sub-steps create a new level)
    * returns current level AsyncSteps object accessor
1. `AsyncSteps parallel( [error_callback onerror] )`
    * creates a step and returns specialization of AsyncSteps interface
        * all add()'ed sub-steps are executed in parallel (not strictly required)
        * the next step in current level is executed only when all parallel steps complete
        * sub-steps of parallel steps follow normal sequential semantics
        * `success()` does not allow any arguments - use `state()` to pass results
1. `Map state()`
    * returns reference to map/object, which can be populated with arbitrary state values
1. *get/set/exists/unset* wildcard accessor, which map to state() variables
    * only if supported by language/platform
1. `AsyncSteps copyFrom( AsyncSteps other )`
    * Copy steps and state variables not present in current state
    from other(model) AsyncSteps object
    * See cloning concept
1. *clone*/*copy c-tor*
    - implementation-defined way of cloning AsyncSteps object
1. `AsyncSteps sync(ISync obj, execute_callback func[, error_callback onerror] )`
    - add step synchronized against obj
1. `AsyncSteps successStep( [result_arg, ...] )`
    - shortcut for `as.add( (as) => as.success( result_arg, ... ) )`
1. `AsyncSteps await( future_or_promise[, error_callback onerror] )`
    - integrate technology-specific Future/Promise as a step

### 2.2.2. Execution API - can be used only inside execute_callback

*Note: `success()` and `error()` can be used in error_callback as well*

1. `void success( [result_arg, ...] )`
    * successfully complete current step execution. Should be called from func()
1. `void error( name [, error_info] )`
    * complete with error
    * throws `FutoIn.Error` exception
    * calls `onerror( async_iface, name )` after returning to execution engine
    * `error_info`- assigned to "error_info" state field
1. `void setTimeout( timeout_ms )`
    * inform execution engine to wait for either success() or error()
    for specified timeout in ms. On timeout, error("Timeout") is called
1. `call operator overloading`
    * if supported by language/platform, alias for success()
1. `void setCancel( cancel_callback oncancel )`
    * set callback, to be used to cancel execution
1. `void waitExternal()`
    * prevent implicit `as.success()` behavior of current step

### 2.2.3. Control API - can be used only on Root AsyncSteps object

1. `execute()` - must be called only once after root object steps are configured.
    * Initiates AsyncSteps execution implementation-defined way
1. `cancel()` - may be called on root object to asynchronously cancel execution
1. `promise()` - must be called only once after root object steps are configured.
    * Wraps `execute()` into native Promise.
    * Returns native Promise object.

### 2.2.4. Execution Loop API - can be used only inside `execute_callback`

1. `void loop( func, [, label] )`
    * execute loop until `as.break()` is called
    * `func( as )` - loop body
    * `label` - optional label to use for `as.break()` and `as.continue()` in inner loops
1. `void forEach( map|list, func [, label] )`
    * for each `map` or `list` element call `func( as, key, value )`
    * `func( as, key, value )` - loop body
    * `label` - optional label to use for `as.break()` and `as.continue()` in inner loops
1. `void repeat( count, func [, label] )`
    * Call `func(as, i)` for `count` times
    * `count` - how many times to call the `func`
    * `func( as, i )` - loop body, i - current iteration starting from 0
    * `label` - optional label to use for `as.break()` and `as.continue()` in inner loops
1. `void break( [label] )`
    * break execution of current loop, throws exception
    * `label` - unwind loops, until `label` named loop is exited
1. `void continue( [label] )`
    * continue loop execution from the next iteration, throws exception
    * `label` - break loops, until `label` named loop is found

### 2.3. `Mutex` class

* Must implemenet `ISync` interface
* Functions:
    * `c-tor(unsigned integer max=1, unsigned integer max_queue=null)`
        * set maximum number of parallel AsyncSteps entering critical section
        * `max_queue` - optionally, limit queue length

### 2.4. `Throttle` class

* Must implemenet `ISync` interface
* Functions:
    * `c-tor(unsigned integer max, unsigned integer period_ms=1000, unsigned integer max_queue=null)`
        * set maximum number of critical section entries within specification time period.
        * `period_ms` - time period in milliseconds
        * `max_queue` - optionally, limit queue length

### 2.5. `Limiter` class

* Must implemenet `ISync` interface
* Functions:
    * `c-tor(options)`
        * Complex limit handling
        * `options.concurrent=1`  - maximum concurrent flows
        * `options.max_queue=0` - maximum queued
        * `options.rate=1`  - maximum entries in period
        * `options.period_ms=1000`  - period length
        * `options.burst=0`  - maximum queue for rate limiting

