---
path: /docs/microservices/serviceapp/
---

# ServiceApp concept

As some of FutoIn sub-projects are quite complex to setup,
a special concept of ServiceApp is available to hide all
boilerplate setup code.

Sub-project may refer to this page for explanations.

## Requirements

ServiceApp should automatically initialize all infrastructure like
CCM, Executors, database connections, etc.

However, such automatic initialization must be configurable via options.
It should be possible to either tune infrastructure options or provide
already initalized objects.
