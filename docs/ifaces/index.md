---
path: /docs/ifaces/
description: FutoIn protocol interface is a universal conventional framework for web, in-browser, cloud, embedded and even human-to-service interaction.
keywords: futoin protocol interface
---

# Interface Intro

FutoIn protocol interface is a universal conventional framework for web, in-browser,
cloud, embedded and even human-to-service interaction.

In FutoIn, business process is a **Service**. Each Service has a named versionable
**interface**. Each interface has strict definition of types and functions called **spec**.
**Spec** is a JSON document in special format.

**Invoker** and **Executor** are two types of roles in FutoIn communication. Invoker
makes calls to Executor. Executor hosts Services. Usually, Invoker is also a client
in network communication.

**FutoIn messages** can be represented in **JSON** (default), **MessagePack**, **CBOR**
and potentially other codecs. Embedded binary data is supported only in later two.
Raw binary data is also supported through HTTP transport.

FutoIn messages can be transmitted through different **communications channels**:
HTTP, WebSockets, datagram protocols (UNIX, UDP, SCTP, Browser cross-page event), other custom
framing on top of streams.

There is special HTTP integration with human-readable URL coding/mapping of message.

## Service interface features

1. Unique Java-style identifier:
    - e.g. `com.example.project.feature`,
    - reserved namespace `futoin.*` for official specs.
1. Semantic Versioning like `1.0` (see [SemVer][]):
    - only two MAJOR and MINOR parts,
    - backward compatibility.
1. Interface inheritance:
    - allow calls to derived interface through the base one.
1. Imports:
    - mixin types and functions, but do not create
        inheritance chain.
1. Complex custom types:
    - inherited from JSON-compatible base types,
    - `integer` as constrained JSON `number`,
    - raw byte vector `data` for non-JSON,
    - type variants (one-of),
    - min/max value constraints for numeric,
    - min/max length for strings, arrays and raw data,
    - item type for arrays,
    - field definition for maps (objects),
    - enums and sets.
1. Strict function definition:
    - identifier (e.g. `someFunc`),
    - parameter definition in standard and custom types,
    - result definition in standard and custom types,
    - list of expected exceptions,
    - raw input/output indication,
    - max request/response payload size,
    - `heavy` request indication.
1. Interface constraints (requirements):
    - allow anonymous access,
    - require secure channel,
    - require Message Authentication Code,
    - require binary codec,
    - require bi-directional channel,
    - others.

## Communication channel features

* Uni-directional:
    - only one peer can act as Invoker,
    - example: HTTP(S).
* Bi-directional:
    - both can act as Invoker and Executor,
    - example: WebSockets, transport protocols, in-browser cross-page events.
* Message multiplexing:
    - allows using a single communication channel for parallel requests,
    - special counter "rid" field to tie requests to responses.
* Channel-specific features:
    - Raw data upload & download for HTTP,
    - Message coding in friendly URL for HTTP.
* Payload size limits based on interface specs.


## Reference specifications

*Note: "spec" refers both to FutoIn specification and particular interface
specification as those are tightly related.*

* [FTN2 Specification Versioning](https://specs.futoin.org/final/preview/ftn2_spec_versioning.html)
* [FTN3 Interface Definition](https://specs.futoin.org/final/preview/ftn3_iface_definition.html)
* [FTN3.1 Common Types](https://specs.futoin.org/final/preview/ftn3.1_if_common_types.html)
* [FTN5 HTTP integration](https://specs.futoin.org/final/preview/ftn5_iface_http_integration.html)


[SemVer]: https://semver.org/
