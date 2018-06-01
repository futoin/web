---
path: /docs/cid/design/
---

# CID Design

First of all, CID is a generic framework for tool plugin processing.

## Tool types

There are the following types of tool plugins:

1. Generic (`SubTool`) - all plugins implement this interface.
1. Build (`BuildTool`) - plugins supporting `cid build` procedure.
1. Test (`TestTool`) - plugins supporting `cid check` procedure.
1. Migration (`MigrationTool`) - plugins supporting `cid migrate` procedure.
1. VCS (`VcsTool`) - plugins supporting `cid vcs` operations.
1. RMS (`RmsTool`) - plugins supporting `cid rms` operations.
1. Runtime Environment (`RunEnvTool`) - plugins providing infrastructure to others (e.g. "nvm").
1. Runtime (`RuntimeTool`) - plugins supporting execution of commands and services (e.g. "exe", "node", "java")

*Note: a single tool may implement more than one interface.*

## Global state

There is a single global tree-like state passed to plugins during invocation.
The details of this strictly defined state tree is available in [`futoin.json` description](/docs/cid/config/).

Some operations must not depend on project configuration - only `.env` part is passed then.

## Entry Points

Entry points are used to describe service runtime type, startup file and runtime tune.
More details are in [dedicated section](/docs/cid/entrypoints/).

## Tool auto-detection

This behavior is triggered on demand.

1. Tools used in entry points are marked as "detected".
1. If `.tools` is set then use it instead of auto detection.
1. Otherwise:
    - load all available plugins.
    - walk through each tool and call its auto-detection API
1. Add all dependencies of "detected" tools as "detected" too.

## Tool dependencies

Usually, plugins require other plugins.

For example: `grunt` requires `npm` which requires `node`
which requires `nvm` which requires `bash` in turn.

CID automatically resolves all dependencies and initializes the plugins
in order of the dependency chain.

## Tool initialization

Each "detected" plugin may contribute own environment to the global state.
If actual tool installation is not found or version constraint mismatches then
plugin tries to install the tool and retry initalization.

Typically, tools contribute `.{tool}Bin` and `.{toolVer}` environment variables.
For example, `nodeBin=/path/to/bin/node` and `nodeVer=8`.

## Tool API reference

Below are links to related plugin base classes. This API may get extended or
changed over time.

* [SubTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/subtool.py)
* [BuildTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/buildtool.py)
* [TestTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/testtool.py)
* [MigrationTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/migrationtool.py)
* [VcsTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/vcstool.py)
* [RmsTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/rmstool.py)
* [RunEnvTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/runenvtool.py)
* [RuntimeTool](https://github.com/futoin/cid-tool/blob/master/futoin/cid/runtimetool.py)

## Performance considerations

Traditional Python programs load all required dependencies as part of each module load. That may
significantly affect startup time and memory usage, if such dependencies are not used in particular
invocation.

As CID is quite sensitive to startup time, there is a special on-demand loading concept. Plugins
must never load any dependencies when they are loaded. Most of standard dependencies are already
provided through [`OnDemandMixIn`](https://github.com/futoin/cid-tool/blob/master/futoin/cid/mixins/ondemand.py).

Other dependencies should be loaded right-before-use in plugin code.

CID also tries to avoid loading all plugins unless strictly necessary. Therefore, it's desired
to define `.tools` configuration to avoid auto-detection procedure.

## Custom plugins

Custom plugins can be added either globally or for specific project.

Please check how this guide uses `release` plugin bundled with CID, but not enabled by default.
Full example is [also available](/docs/cid/example/).

```json
{
  "plugins": {
    "release": "futoin.cid.misc.releasetool"
  }
}
```
