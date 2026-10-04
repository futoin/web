---
path: /docs/asyncsteps/api/
---

# AsyncSteps API reference

This is an excerpt from [FTN12 v1.16](https://specs.futoin.org/final/preview/ftn12_async_api-1.16.html) AS IS.

Please make sure you get familiar with the concept through the [Introduction](/docs/asyncsteps/) first.

# 2. Async Steps API

## 2.1. Types

* `void execute_callback( AsyncSteps asi[, previous_success_args] )`:
    * the first argument is always an AsyncSteps object;
    * other arguments come from the previous `asi.success()` call, if any;
    * returns nothing;
    * behavior:
        * either set the completion status through `asi.success()` or
          `asi.error()`;
        * or add sub-steps, including loops;
        * optionally, set time limits through `asi.setTimeout()` and/or
          set a cancel handler through `asi.setCancel()`;
        * any violation is reported as `asi.error( InternalError )`;
    * can use `asi.state()` for global current job state data.
* `void error_callback( AsyncSteps asi, error )`:
    * the first argument is always an AsyncSteps object;
    * the second argument comes from the previous `asi.error()` call;
    * returns nothing;
    * behavior, completes through:
        * `asi.success()` - continue execution from the next step after return,
        * `asi.error()` - change error string,
        * a silent return - continue unwinding error handler stack,
        * any violation is reported as `asi.error( InternalError )`.
    * can use `asi.state()` for global current job state data.
* `void cancel_callback( AsyncSteps asi )`:
    * must be used to cancel external AsyncSteps program flow actions,
      like waiting on a connection, timer, dedicated task, etc.
* `interface ISync`
    * `void sync( AsyncSteps asi, execute_callback[, error_callback] )`:
        * synchronizes independent or parallel AsyncSteps, executes provided
          callbacks in a critical section.
* `interface State`
    * technology-specific;
    * dynamically-typed (e.g. ECMAScript):
        an object or map of key-value pairs;
    * statically-typed (e.g. C++, Java):
        - `interface CatchTrace` for `callback(asi, exception)` on any caught
          exception;
        - `interface UnhandledError` for `callback(asi, error)` on any unhandled
          FutoIn error in steps;
        - `ValueRef get<V>(key)` - get-accessor for dynamic items, type cast;
        - `ValueRef set<V>(key, value)`- set-accessor for dynamic items,
          type cast;
        - `ValueRef set_default<V>(key, value)`- set for dynamic items if not
          present, type cast;
        - `error_info` - get/set last `error_info` property;
            - split `set_error_info()` / `error_info()` accessor as applicable;
        - `last_exception()` - get last caught exception;
        - `catch_trace` - get/set last `CatchTrace` property;
            - split `set_catch_trace(cb)` / `get_catch_trace()` accessor as
              applicable;
        - `unhandled_error` - get/set last `UnhandledError` property;
            - split `set_unhandled_error(cb)` / `get_unhandled_error()`
              accessor as applicable;
        - `cancel_handler` - get/set last `CancelCallback` property;
            - split `set_cancel_handler(cb)` / `get_cancel_handler()` accessor
              as applicable;
        - `mem_pool` - get associated memory pool property, if applicable;
            - or `mem_pool()` accessor as applicable.

## 2.2. Functions

It is assumed that all functions in this section are part of
**the single AsyncSteps interface**. However, they are grouped by semantic scope
of use. Such design violates certain best practices, but it is done
intentionally.

### 2.2.1. Common API

This API can be used in any context.

1. `AsyncSteps add( execute_callback func[, error_callback onerror] )`:
    * adds a step; the executor callback gets async interface as the first
      parameter;
    * can be called multiple times to add sub-steps of the same level for
      sequential execution;
    * steps are queued in the same execution level;
    * returns current level `AsyncSteps` object accessor for easy chaining.
1. `AsyncSteps parallel( [error_callback onerror] )`:
    * creates a step and returns a specialization of AsyncSteps interface:
        * all `add()`ed sub-steps are executed in parallel in the same thread,
        * the next step in current level is executed only when all parallel
          steps complete,
        * sub-steps of parallel steps follow normal sequential semantics,
        * `success()` does not allow any arguments - use either `state()` or
          `stack()` to pass results.
1. `State state()`:
    * each technology-specific state has its own interfaces and semantics;
    * contains a reference to map/object, which can be populated with arbitrary
      state values;    
    * note: if boolean cast is not supported in given technology, then it should
      return an equivalent of `null` to identify invalid state of the AsyncSteps
      object;
    * additional helpers:
        1. `ValueRef state(key)` - alias for `state().get(key)`;
        1. `ValueRef state(key, defaultValue)` - alias for
           `state().set_default(key, value)`.
1. `AsyncSteps copyFrom( AsyncSteps other )`:
    * **deprecated**;
    * copies steps and state variables not present in current state
      from other (model) AsyncSteps object;
    * see cloning concept.
1. `AsyncSteps sync(ISync obj, execute_callback func[, error_callback onerror] )`:
    - adds a step synchronized against `obj`.
1. `AsyncSteps successStep( [result_arg, ...] )`:
    - efficient shortcut for `as.add( (as) => as.success( result_arg, ... ) )`.
1. `AsyncSteps await( future_or_promise[, error_callback onerror] )`:
    - integrate technology-specific Future/Promise as a step.
1. `AsyncSteps newInstance()`:
    - create new instance of AsyncSteps for standalone execution through
      agnostic interface with direct dependency on implementation;
    - new instance must inherit `catch_trace`, `unhandled_error`, and
      `cancel_handler` handlers.
    - new instance must directly or indirectly inherit associated
      `mem pool`.
1. `boolean cast()`:
    - true if AsyncSteps interface is in valid state for usage;
    - if not possible in given technology, see `state()` notes.
1. `FutoInAsyncSteps cast()`:
    - cast to binary AsyncSteps interface pointer as applicable in technology;
    - if not possible in given technology, see `binary()` notes.
1. `FutoInAsyncSteps binary()`:
    - get naked binary AsyncSteps interface pointer as applicable in
      specific technology.
1. `AsyncSteps wrap(FutoInAsyncSteps)`:
    - adopt binary interface pointer as applicable;
    - if binary interface is implemented by same technology, it
      should be a simple cast;
    - otherwise, foreign implementation should be seamlessly wrapped;
    - returned instance must be used, but not the one on which `wrap()` is
      being called.
    - new returned instance is independent of current AsyncSteps instance.

### 2.2.2. Execution API

This API can be used only inside `execute_callback` context. `success()`
and `error()` can be used in `error_callback` context as well.

1. `void success( [result_arg, ...] )`
    * successfully completes current step's execution;
    * normally called from `execute_callback`;
    * however, can be called outside of `AsyncSteps` stack during external
      event waiting;
    * technology-specific implementation can assume no more than 4
      result arguments can be supplied, as derived from binary interface.
1. `void error( name [, error_info] )`:
    * completes step with error;
    * throws `FutoIn.Error` exception immediately;
    * calls `onerror( async_iface, name )` after returning to execution engine;
    * `error_info` is assigned to `error_info` state field.
1. `void errorNoThrow( name [, error_info] )`:
    * special variation of `asi.error()` which does not throw;
      user must return from executing function without relying on
      exceptions.
1. `void setTimeout( timeout_ms )`:
    * disables implicit success with assumption of external event
      waiting if no sub-steps are added;
    * on timeout, `Timeout` error is raised.
1. `call operator overloading`:
    * if supported by language/platform, alias for `asi.success()`.
1. `void setCancel( cancel_callback oncancel )`:
    * sets callback used to cancel execution.
1. `void waitExternal()`:
    * prevents implicit success behavior of current step.
1. `void relinquish()`:
    * shortcut for step add(), forcing AsyncSteps engine to relinquish
      control flow back to AsyncTool event loop.
1. `Pointer stack(size[, destroy_cb])`:
    * allocates temporary object with lifetime of current step for non-GC
      technologies.

### 2.2.3. Control API

This API can be used only on Root AsyncSteps objects.

1. `void execute()` - must be called only once after root object steps are
   configured.
    * Initiates AsyncSteps execution in implementation-defined way using
      associated instance of AsyncTool.
1. `void cancel()` - may be called on root object to asynchronously cancel
   execution.
    * Cancellation typically happens on continuation of `AsyncSteps` execution.
    * Inner-cancel must be done with `asi.error()`.
1. `Promise promise()` - must be called only once after root object steps
   are configured.
    * Wraps `execute()` into a native Promise object.
    * Returns a native Promise or Future object.

### 2.2.4. Execution Loop API

This API can be used only inside `execute_callback`.

1. `void loop( func, [, label] )`:
    * executes loop until `asi.break()` is called;
    * `func( asi )` - loop body;
    * `label` - optional label to use for `asi.break()` and `asi.continue()`
      in inner loops.
1. `void forEach( map|list, func [, label] )`:
    * for each `map` or `list` element, call `func( asi, key, value )`;
    * `func( asi, key, value )` - loop body;
    * `label` - optional label to use for `asi.break()` and `asi.continue()`
      in inner loops.
1. `void repeat( count, func [, label] )`:
    * calls `func(asi, i)` `count` times;
    * `count` - how many times to call `func`;
    * `func( asi, i )` - loop body, `i` - current iteration starting
      from `0`;
    * `label` - optional label to use for `asi.break()` and `asi.continue()`
      in inner loops.
1. `void break( [label] )`:
    * breaks execution of current loop;
    * raises a special exception handled by `AsyncSteps`
      internally;
    * `label` - unwinds nested loops until `label` named loop is exited.
    * label must be recorded as `error_info`.
1. `void breakNoThrow( [label] )`:
    * variation of `break()` that does not throw; user must return from
      step immediately.
1. `void continue( [label] )`:
    * continues loop execution from next iteration;
    * raises a special exception handled by `AsyncSteps`
      internally;
    * `label` - breaks nested loops until `label` named loop is found.
    * label must be recorded as `error_info`.
1. `void continueNoThrow( [label] )`:
    * variation of `continue()` that does not throw; user must return from
      step immediately.

### 2.3. `Mutex` class

* Must implement `ISync` interface.
* Functions:
    * `c-tor(unsigned integer max=1, unsigned integer max_queue=null)`:
        * sets maximum number of parallel AsyncSteps entering critical
          section;
        * `max_queue` - optionally limit queue length.

### 2.4. `Throttle` class

* Must implement `ISync` interface.
* Functions:
    * `c-tor(unsigned integer max, unsigned integer period_ms=1000, unsigned integer max_queue=null)`:
        * sets maximum number of critical section entries within
          given time period;
        * `period_ms` - time period in milliseconds;
        * `max_queue` - optionally limit queue length.

### 2.5. `Limiter` class

* Must implement `ISync` interface.
* Functions:
    * `c-tor(options)`:
        * Complex limit handling;
        * `options.concurrent=1` - maximum number of concurrent flows;
        * `options.max_queue=0` - maximum number of queued flows;
        * `options.rate=1` - maximum number of critical section entries
          in given period;
        * `options.period_ms=1000` - time period in milliseconds;
        * `options.burst=0` - maximum number of queued flows for rate
          limiting.

### 2.6. AsyncTool event loop interface

There is a strong assumption that AsyncSteps instances are executed in partial
order by a common instance of event loop, with historical name AsyncTool.

There is an assumption that AsyncTool will be extended with Input/Output event
support to act as a true reactor, but it may not always be possible.

AsyncTool was not defined in previous versions of specification because its
interface is technology-specific, even though it always existed. Below is only
**a general suggestion**.

1. `Handle immediate( func )`:
    - schedule immediate callback;
    - `func()` - general callback.
1. `Handle deferred( delay, func )`:
    - schedule callback with delay;
    - `delay` - typically time period in milliseconds;
    - `func()` - general callback.
1. `bool is_same_thread()`:
    - check if current operating system thread is same as internal
      event loop's thread;
    - if applicable at all.
1. `void cancel( handle )`:
    - cancel previously scheduled callback;
    - should not be an error if callback has already been executed;
    - this method may be part of `Handle` object interface.
1. `bool is_valid( handle )`:
    - ability to check if handle still refers to scheduled task;
    - this method may be part of `Handle` object interface.
