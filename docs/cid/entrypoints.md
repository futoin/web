---
path: /docs/cid/entrypoints/
---

# CID Entry Points

Entry Point - is fundamental part to describe service which is expected to
run in production.

> Entry Point is not equal to service instance. There can
be more than one instance per single entry point definition. Please check
[Deployment section](/docs/cid/deploy/) for details of instance count
auto-configuration.

## Configuration

Entry points are expected to be set in project `futoin.json` manifest
as `.entryPoints.{name}`. However, they can be set and/or tuned in
deployment configuration as well.

> The amount of options below may look very difficult to understand, but they cover almost all
possible cases found in real life. **Most of configuration comes from each tool as reasonable default!**

**Main options:**

* `.tool` - associated Runtime tool.
* `.path` - file or directory entry point location relative to project root.
* `.tune` - additional configuration for fine tuning.

**Resource allocation constraints:**

* Overall:
    * `.tune.minMemory` - minimal memory per instance of given entry point without connections.
    * `.tune.maxMemory` - maximal memory per instance (for very specific cases).
    * `.tune.maxTotalMemory` - maximal memory for all instances of given entry point (for very specific cases).
    * `.tune.debugOverhead` - extra memory per instance in "dev" deployment.
    * `.tune.cpuWeight = 100` - arbitrary positive integer (affects cgroup limits).
    * `.tune.memWeight = 100` - arbitrary positive integer (affect memory distribution).
* Per connection:
    * `.tune.connMemory` - extra memory per one connection.
    * `.tune.debugConnOverhead` - extra memory per connection in "dev" deployment.
    * `.tune.connFD = 16` - file descriptors per connection (affects max file descriptor limit).
* Web server integration:
    * `.tune.internal = false` - if true, then resource is not exposed
    * `.tune.socketTypes` = ['unix', 'tcp', 'tcp6'] - supported listen socket types
    * `.tune.socketProtocol` = one of ['http', 'fcgi', 'wsgi', 'rack', 'jsgi', 'psgi']
    * `.tune.socketType` - generally, for setup in deployment config
    * `.tune.socketPort` - default/base port to assign to service (optional)
    * `.tune.maxRequestSize` - maximal size of single request (mostly applicable to HTTP request)
* Misc.:
    * `.tune.scalable` - if false then it's not allowed to start more than one instance globally.
    * `.tune.reloadable` - if true then reload WITHOUT INTERRUPTION is supported.
    * `.tune.multiCore` - if true then single instance can span multiple CPU cores.
    * `.tune.exitTimeoutMS` - how many milliseconds to wait after SIGTERM before sending SIGKILL.
    * `.tune.maxInstances` - limit number of instances per deployment.

## Tool tune

It's important to note that tool tune is specific only to entry point where it is defined. It's
also possible to apply tool tune for whole project using `.toolTune` configuration described
in [Tools sections](/docs/cid/tools/).

## Examples

A typical configuration is much simpler:

```json
{
  "entryPoints": {
    "web": {
      "path": "public",
      "tool": "nginx"
    },
    "app": {
      "path": "config.ru",
      "tool": "puma",
      "tune": {
        "connMemory": "32M",
        "minMemory": "256M"
      }
    }
  }
}
```

