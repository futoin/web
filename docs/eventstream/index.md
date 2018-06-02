---
path: /docs/eventstream/
---

# FutoIn EventStream

FutoIn EventStream is fundamental part for efficient global state update in
distributed systems. It is used for reliable event delivery, decentralized cache
invalidation, efficient online segregation of active and warehouse data.

Unlike various message/event brokers, the focus of FutoIn Event Stream is integration
with database transactions for reliable efficient event recording and delivery.

The design is not focused on high throughput as the primary target is reliable association of events
with database changes. However, this concept can be used for pure message brokers as well.

This concept is defined as [FTN18](http://specs.futoin.org/final/preview/ftn18_if_eventstream.html).

## Features

* Database transaction-bound event generation.
* Standalone event generation.
* Event polling for simple, but less efficient solutions.
* Event pushing for advanced efficient cases.

## Supported database types

* MySQL
* PostgreSQL
* SQLite
* Potentially, any other SQL-compliant supported by `futoin-database`

## Concept

Each event has auto-generated sequential ID, type, data and timestamp. Type is all upper case identifier.
Data is arbitrary JSON-friendly data.

Two configurable delivery strategies are supported: polling and streaming, but consumer
acts as client in both cases.

There are two delivery modes: reliable and live. The later allow messages to be skipped.
To ensure that events are reliably delivered, each consumer must register first.

### Event structure

* `id` - sequential ID which must not be used outside of event delivery scope
* `type` - arbitrary event type
* `data` - arbitrary JSON-friendly event data
* `ts` - event generation timestamp for reference purposes

### Components

Each generating peer has a list of consumers. Such readers are called "components". It's assumed
that consumers are distributed parts of complex systems - that's where the name comes from.

There is a special component called "LIVE". It cannot be registered. Unlimited amount of
peers can use it to poll or receive events. Live stream of events is always sent.

### Filters

Very often, consumer is not interested in all possible events. It's inefficient to distribute
all events in such case. Therefore, optional event type filters are supported at read time.

### Reliable delivery

FutoIn EventStream engine guarantees to keep all undelivered events in active queue.

Event is considered delivered when its ID is below the last read one on poll. For pushing,
event is marked delivered when push call successfully completes.

All other events may be archived or discarded to optimize active database.
