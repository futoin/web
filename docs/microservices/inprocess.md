---
path: /docs/microservices/inprocess/
---

# In-process calls

FutoIn Invoker and Executor are quite efficient for monolithic applications.

There is no message coding is done, but request parameters and result values
are checked to comply with the specification. However, such behavior may be
disabled in Production for even better performance at cost of some compliance safety.

By default, all internal calls are made with `System` privilege level. If call
is made from AsyncSteps thread processing another inbound API call then original
user credentials are passed as "on-behalf-of" by default. That is a safety feature
to avoid privilege escalation. It can be overridden during relevant interface
registration in CCM.

