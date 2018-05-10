---
path: /docs/microservices/
---

# FutoIn Microservices concept

Any mature well-designed monolithic application is split into program
modules. Each FutoIn service can be seen as such module. Each call to Service
is done as ordinary function call.

Unlike common misconception based on alternative microservice solutions,
FutoIn microservices are designed for scalability across processes and nodes,
but they still fit into a monolithic application very well.

*Note: please learn [FutoIn Interface](/docs/ifaces/) first.*

The FutoIn microservice terminology:

1. **Iface** - FutoIn-based API specification.
1. **Service** - implementation of business logic with strictly defined interface.
1. **Executor** - processes requests made to registered **Services**.
1. **Invoker** - a party which make requests to **Executor** to execute **Service** logic.
1. **CCM** - Connection & Credentials Manager - essential part of **Invoker** to maintain
   communication channels, direct requests to known endpoints and provide call security.

## FutoIn application

A bare minimal FutoIn application requires at least one **CCM** to request remote
peers or **Executor** to process API requests.

However, a typical FutoIn application consists of the following parts:

1. **CCM** - essential central part to:
    - register remote, local and in-process named API endpoints,
    - perform requests to the API endpoints identified by name,
    - transparently handle security aspects,
    - check requests and responses against FutoIn interface specs.
1. Internal **Executor** - one or more instances to handle in-process
   calls for application sub-systems with `System` security level.
    - Common case is execution of Database, Cache and other lower level API services.
1. Public **Executor** - receive and process calls from other peers.
    - Typically used to host primary business logic.

## Primary benefits

**FutoIn is API focused** - quite strict, but still very human-friendly interfaces.

**Security concept is integral part of API** - each message is atomic and self-sufficient
for transportation and processing.

**FutoIn API is agnostic to transport channel** - no dependency on heavy HTTP framing. Each
message can be easily re-coded from one representation to another without lose of any
information while it transits from Invoker to Executor and back. More effective message
coding techniques can be introduced without Service code changes.

## Runtime environment

Primary runtime is server environment using any of technologies:
Node.js, PHP, Ruby, Python, Java, Go, C/C++, Rust, etc.

Client applications can be built using FutoIn communication concept as well. Quite common case is
dynamic website or even native apps.

## Scalability, security and high availability

The same business logic can be bundled into a single application process for maximum
performance avoiding API message marshalling logic. 

For bare simple high availability, two and more instances of such applications may run
with proper load balancer in front of them.

Over time, many projects separate some parts of a monolithic applications based on
separation of expanded development teams and their scope of responsibilities,
security scope of critical business logic, performance/stability considerations, etc.

FutoIn microservice concept allows achieving that without any business logic code
modification - each Service is agnostic to deployment configuration.

For maximum security, a large FutoIn project should have an isolated gateway (hub) to handle
API message authentication, enforce processing limits and integrate defense systems.

## Centralized hubs vs. service discovery

*Note: this functionality is in development.*

Overall Cloud community shifts towards Service Discovery which assumes component-to-component
interaction. Even though it has performance benefits, it is more difficult to trace such communication
for security and manageability purposes.

Instead, FutoIn architecture is a centralized Hub. All Executors dynamically register against such Hub
through a bi-directional channel. High-availability and scalability details are hidden in the
Hub implementation. They can change over time without requiring Executor changes.

Benefits:

* Business Logic can gradually change without breaking established client connections.
* External API endpoint can also pass through the Hub.
* The Hub may seamlessly redirect message to another Executor instance on technical failure.
    - More fine control then generic load balancer can provide.
* Executor's security logic can be more lightweight when the Hub takes such responsibilities.
    - Easier and safer to add support for new technologies.
    - Shrinking of security scope.
* Communication failure and/or node downtime is detected directly.
    - Basically, a better integration of service discovery.
* Higher security through more strict isolation of components.
    - Simpler to setup firewall and other isolation mechanisms.
* Greater possibilities for security and debugging of production cases.
    - Possibility to add advanced logic by authorized security team without affecting ordinary
      applications with business logic.

