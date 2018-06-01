---
path: /docs/cid/config/
---

# `futoin.json` Reference

This is modified excerpt from [FTN16](https://specs.futoin.org/final/preview/ftn16_cid_tool.html).

## Configuration files

* Name: `futoin.json`
* Format: strict JSON
* Location (project): project root folder (without `.env` part)
* Process environment: (only whitelisted variables for `.env` part)
* Location (deployment): `${DEPLOY_ROOT}` (both config options and `.env` part)
* Location (user): `${HOME}/.futoin.json` (only `.env` part)
* Location (global): `/etc/futoin/futoin.json` (only `.env` part)

### JSON tree definition in dot notation.

The same identifiers should be used in command line options. All configuration nodes are optional
and auto-detectable in most cases.

*Note: this tree represents actual state CID works with. All internal API either work with full
configuration root or only with its `.env` part. There should be no other configuration data.*

#### Project configuration

* `.name` - project's full unique name
* `.version` - project's version
* `.vcsRepo` - source repository
* `.vcs` - version control system type:
    * "svn"
    * "git"
    * "hg"
* `.deployBuild` - force build on deploy, if true
* `.permissiveChecks` - allows check failure, if true
* `.rmsRepo` - binary artifact Release Management System location
* `.rmsPool` - sub-path/pool in `.rmsRepo`
* `.rms` - release management system type:
    * "svn" - use Subversion as binary artifact repository
    * "scp" - use SSHv2 FTP
    * "archiva" - use Apache Archiva
    * "artifactory" - use JFrog Artifactory
    * "nexus" - use Sonatype Nexus
* `.tools - {}`, map of required tool=>version pairs.
    Default version is marked as `true` or `'*'`.
    Tool name is all lower case letters with optional digits (except the first position).
* `.toolTune - {}`, map of maps tool=>settings=>value for fine tuning of tool behavior.
    * *Note: it should be used for build-time tools, but it can also be used for global `.entryPoints` tuning* by tool.
* `.package - []`, content of package relative to project root. Default: [ "." ]
* `.packageGzipStatic = True`, creates *.gz files for found *.js, *.json, *.css, *.svg and *.txt files
* `.packageChecksums = True`, creates .package.checksums of files
* `.persistent - []`, list of persistent read-write directory paths.
    - Content of related deployment package paths is copied to persistent location.
* `.writable - []`, list of non-persistent read-write directory paths.
    - Can be used for version-specific caches.
* `.entryPoints - {]`, list of named entry points {}
    * `.tool` - name of the tool
    * `.path` - file
    * `.tune` - {}, type-specific configuration options (extandable)
        * `.minMemory` - minimal memory per instance without connections
        * `.connMemory` - extra memory per one connection
        * `.connFD = 16` - file descriptors per connection
        * `.internal = false` - if true, then resource is not exposed
        * `.scalable = true` - if false then it's not allowed to start more than one instance globally
        * `.reloadable = false` - if true then reload WITHOUT INTERRUPTION is supported
        * `.multiCore = true` - if true then single instance can span multiple CPU cores
        * `.exitTimeoutMS = 5000` - how many milliseconds to wait after SIGTERM before sending SIGKILL
        * `.cpuWeight = 100` - arbitrary positive integer
        * `.memWeight = 100` - arbitrary positive integer
        * `.maxMemory` - maximal memory per instance (for very specific cases)
        * `.maxTotalMemory `- maximal memory for all instances (for very specific cases)
        * `.maxInstances` - limit number of instances per deployment
        * `.socketTypes = ['unix', 'tcp', 'tcp6']` - supported listen socket types
        * `.socketProtocol` = one of `['http', 'fcgi', 'wsgi', 'rack', 'jsgi', 'psgi']`
        * `.debugOverhead` - extra memory per instance in "dev" deployment
        * `.debugConnOverhead` - extra memory per connection in "dev" deployment
        * `.socketType` - generally, for setup in deployment config
        * `.socketPort` - default/base port to assign to service
        * `.maxRequestSize` - maximal size of single request
* `.configenv - {}` - list of environment variables to be set in deployment
    * `.type` - FutoIn variable type
    * `.desc` - variable description
* `.webcfg` - additional web server configuration (to be used by web server)
    * `.root` - web root folder relative to project root
    * `.main` - default index handler from .entryPoints (auto-select, if single one)
    * `.mounts - {}` - path prefix to details in form of:
        - string - name of related entry point
        - map - advanced config
            - `.app` - name of related entry point
            - `.static = false` - try to serve static files, if true
            - `.tune = {}` - fine options
                - `.pattern = true` - enable other options based on pattern match
                - `.staticGzip = true` - try to use pre-compressed "*.gz" files
                - `.gzip = false` - compress in transmission
                - `.expires = 'max'` - add expires header
                - `.autoindex = false` - enable auto-indexing
                - `.index = 'index.html'` - default index file
                - `.etag = false` - enable ETag
* `.actions - {}`, optional override of auto-detect commands.
    Each either a string or list of strings.
    Use `@default` in [] to run the default auto-detected tasks too.
    Use of `@default` in deploy config means actions defined/detected in project config.
    Start command with `@cid` to invoke FutoIn CID itself.
    * `.tag` - custom shell command for tagging
    * `.prepare` - custom shell command for source preparation
    * `.build` - custom shell command for building from source
    * `.package` - custom shell command for binary artifact creation
    * `.promote` - custom shell command for binary artifact promotion
    * `.migrate` - custom shell command in deployment procedure
    * `.deploy` - custom shell command for deployment from binary artifact
    * `.{custom}` - any arbitrary user-defined extension to use with "cid run"
* `.plugins = {}` - optional custom plugins, see .env counterpart
* `.pluginPacks = []` - optional custom plugin packs, see .env counterpart

#### Environment configuration

* `.env - {}`, the only part allowed to be defined in user or system configs
    * `.type` - "prod", "test" and "dev" (default - "prod")
    * `.persistentDir = {.deployDir}/persistent` - root for persistent data
    * `.vars` - arbitrary environment variables to set on execution
    * `.plugins = {}` - custom plugins, implementation defined
        * $tool => $module_name pair - individual tool
    * `.pluginPacks = []` - custom plugin packs, implementation defined
        * $module_name - define module providing list of plugins
    * `.binDir = ${HOME}/bin` - user bin folder
    * `.externalSetup = false`
        - a shell command to call instead of CID with the same parameters, if set to string
        - disable tool setup, if true
    * `.externalServices = []`
        - list of tools which should not be accounted in resource distribution
        - it's expected the tools are externally configured by provisioning system
    * `.timeouts` - timeout configuration for various operations (may not be always supported)
        * `.connect = 10` - initial connection timeout 
        * `.read = 60` - network timeout for individual read calls
        * `.total = .read * 60` - network timeout for single request
    * `.{tool}Bin` - path to "$tool" command line binary
    * `.{tool}Dir` - path root "$tool", if applicable
    * `.{tool}Ver` - required version of "$tool", if applicable
    * `.{tool}{misc}` - any tool-specific misc. configuration

#### Deployment configuration

* `.deploy`
    * `.maxTotalMemory` - memory limit for deployment
    * `.maxCpuCount` - CPU count the deployment expected to utilize
    * `.listenAddress` - address to bind services by default
    * `.user` - user for service execution
    * `.group` - group for service execution
    * `.runtimeDir = {.deployDir}/.runtime` - location for temporary files required for runtime:
        * UNIX socket files
        * UNIX pipes
        * Process ID files
        * On-the-fly configuration files
    * `.tmpDir = {.deployDir}/.tmp` - location for other temporary files
    * `.autoServices` - map of lists, to be auto-generated in deployment process
        * `.maxMemory` - maximal memory per instance (for deployment config)
        * `.maxCpuCount` - maximal CPU count an instance can use (for multiCore)
        * `.maxConnections` - expected number of clients the instance can handle
        * `.maxFD` - maximal file descriptors
        * `.socketType` - one of .entryPoints[.entryPoint].socketTypes
        * `.socketAddress` - assigned socket address, if applicable
        * `.socketPort` - assigned socket port, if applicable
        * `.socketPath` - assigned socket path, if applicable
        * tool-specific - any tool-specific value like "nginxConf"

#### Runtime configuration (available to plugins)

* `.target` - (dynamic variable) current build target
* `.vcsRef` - (dynamic variable) current branch name
* `.wcDir` - (dynamic variable) working directory name for fresh clone/checkout
* `.deployDir` - (dynamic variable) root for current package deployment
* `.reDeploy` - (dynamic variable) force deploy, if true
* `.debugBuild` - (dynamic variable) build in debug mode
* `.tool` - (dynamic variable) current tool to be used
* `.toolVer` - (dynamic variable) required version for current tool
* `.toolOrder` - (dynamic variable) full ordered by dependency list of active tools
* `.packageFiles` - (dynamic variable), list of packages created by tools

#### Python-based CID implementation notes

1. `.plugins` expects fully qualified module named with `{tool}Tool` class.
2. `.pluginPacks` expects fully qualified module name with submodules
    in `{tool}tool.py` format having `{tool}Tool` class

### Process environment

Each tool may have a whitelist of related environment variables for .env sections.
This variables may be passed through process environment as well. Example:

```bash
    rubyVer=2.3 cid tool install ruby
    rubyVer=2.3 cid tool exec ruby -- ruby-specific-args
```
