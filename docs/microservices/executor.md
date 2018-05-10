---
path: /docs/microservices/executor/
---

# FutoIn Executor

**Executor** is the fundamental part for FutoIn Service application.

It provides:

1. Service instance registration.
1. Request and response message validation against Iface spec.
1. Authentication and authorization processing.
1. Throughput and concurrency limits per client/group of clients.
1. Unified additional request information representation.
1. Maintenance of persistent communication channels from clients.

Original specification can be found at [FTN6: FutoIn Executor Concept][FTN6].

## Native API

Native Executor API should never be used by Service code. It is provided only
for Service application initialization boilerplate.

The relevant member functions:

1. `AdvancedCCM ccm()` - get reference to Invoker CCM, if any
1. `void register( AsyncSteps as, ifacever, impl )` - add interface implementation
    * ifacever must be represented as FutoIn interface identifier and version, separated by colon ":"
    * impl is object derived from native interface or associative name for lazy loading
1. `void initFromCache( AsyncSteps as )`
    * load initialization from cache
1. `void cacheInit( AsyncSteps as )`
    * store initialization to cache
1. `void close()`
    * Shutdown Executor processing
1. `void limitConf(name, options)`
    * Setup configuration of custom limit
    * *name* - custom limit name
    * *options* - AsyncSteps Limiter options
1. `void addressLimitMap(map)`
    * Configure static address to custom limit mapping
    * *map* - custom limit name to list of CIDR addresses

## Request throttling

For general stability and fair use, compliant Executor implementation should throttle
API requests based on source address at least. Additional limits may be imposed per user ID.

Please check [AsyncSteps Limiter](/docs/asyncsteps/limiter/) to better understand the logic of throttling.

The limits are configured per "limit zone" type. The limit zone is created based on source address to
limit zone type map. Source address can support CIDR-like network mask to better protect from DDoS attacks.

The pre-defined limit zone types are:

* "default"
    * *concurrent=8*  - maximum active requests at any single time
    * *max_queue=32* - pending requests
    * *rate=10*  - requests per period
    * *period_ms=1000*  - period of one second
    * *burst=null*  - unlimited (max concurrent by fact)
* "unlimited"
    * *concurrent=int_max*
    * *max_queue=null*
    * *rate=int_max*
    * *period_ms=1000*
    * *burst=null*

Custom limits can be configured through `Executor#limitConf()`. Request limit zone can
be configured for address or range of addresses trough `Executor#addressLimitMap()`.

[FTN6]: https://specs.futoin.org/final/preview/ftn6_iface_executor_concept.html

