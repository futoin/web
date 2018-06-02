---
path: /docs/db/
---

# FutoIn Database Concept

Database interface is fundamental part of almost any technology stack.
The primary focus is for interface of classical Relational Database Systems.

As usual, official specification is available as [FTN17][].

[FTN17]: https://specs.futoin.org/final/preview/ftn17_if_database.html

## Features

* Auto-configuration and connection pooling by design.
* Supported database engines:
    - MySQL,
    - PostgreSQL,
    - SQLite,
    - any other can be added externally or in main source code.
* Conceptual Query and Transaction builders.

## Design Overview

Interface is split into levels reflecting database engine capabilities.

### Level 1

Level 1 is very basic interface allowing execution of standalone queries.

A special client-side `QueryBuilder` is provided to allow neutral application
code writing.

### Level 2

Level 2 is focused on transactions. All transactions are executed as a batch
of related statements with no delay.

A special client-side `XferBuilder` is provided to allow neutral application
code writing and expose extra features.

The overall idea is to execute a list of statements on DB side in single transaction
one-by-one. After each xfer, trivial validation is done like amount of affected rows
or count of rows in result. This allows creating complex intermediate checks in
native DB query. Such pattern avoids blocking on usually expensive DB connection
and forces to execute transaction with no client-side delays. Also, proper release
of connection to DB connection pool is ensured.

If at any step an error occurs then whole transaction is rolled back.

*Note: internally, it's assumed that there is a limited number of simultaneous
DB connection allowed which are managed in connection pool for performance reasons,
but such details are absolutely hidden from clients.*

### Level 3

Is not specified yet, but planned for bi-directional interfaces with streaming results.


