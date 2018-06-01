---
path: /docs/cid/deploy/
---

# CID in Deployment

Continuous Deployment was the second initial reason for FutoIn CID development.

CID is designed for zero-downtime rolling deployment with automatic migration support.

CID can be used standalone, but integration with provisioning systems is supported
for maximum efficiency. A good reference integration is CodingFuture [cfweb module](https://codingfuture.net/docs/cfweb/).

## Features

* Rolling deployment with zero downtime
* Automatic migration hooks (e.g. database schema update through flyway, liquibase, etc.)
* Resource limit auto-detection & distribution
* Multiple entry points per project
* File security enforcements (read-only)

## Deployment folder

A typical deployment folder:

* `current` - symlink to active deployed version `{ver}`.
* `persistent/` - folder or symlink to location for persistent file storage.
* `vcs/` - VCS cache to optimize network usage of source deployments.
* `{ver}` - VCS reference (tag or branch+revision) name or RMS package without extension.
    - active deployment
* `{ver}.tmp` - project version during deployment.
    - next active deployment after successful completion.
* `{ver}.{ext}` - package file for RMS deployments.
    - automatic cleanup process leaves only current active `{ver}` package for
      efficient forced re-deployment on demand.
* `.env` - optional file with environment configuration.
    - gets symlinked into `{ver}/.env`, if exists.
* `.futoin-deploy.lock` - mandatory file as safety feature.
* `futoin.json` - deployment configuration.
* `.futoin.merged.json` - merged project, deployment and environment configuration
    files with all default values set. Useful for provisioning systems.
* `.{any}` - any hidden ignored file or folder.

**All other files are forcibly removed!** Thefore, CID requires deployment target folder
to be completely empty or hold mandatory `.futoin-deploy.lock` file as safety feature

## Resource limits auto-detection

All resource limits are container-friendly (e.g. Docker) and
automatically detected based on the following:

* RAM:
  1. `--limit-memory` option is used, if present.
  2. cgroup memory limit is used, if less than amount of RAM.
  3. half of RAM is used otherwise.
  4. Memory units: one of B, K, M, G postfixes is required. Example: 1G, 1024M, 1048576K, 1073741824B
* CPU count:
  1. `--limit-cpus` option is used, if present.
  2. cgroup CPU count is used, if present.
  3. all detected CPU cores are used otherwise.
* Max clients:
  * Auto-detected based on available memory and entry point configuration of `.connMemory`.
  * Can be used by load balancers and reverse-proxy servers.
* File descriptor limit - auto-detected based on max clients and configured
  file descriptor count per client.
* Instance count per entry point:
  1. if not `scalable` then only single instance is configured.
  2. if not `multiCore` then:
     * get theoretical maximum of instances based on doubled `.minMemory`
     * get CPU limit count
     * use `maxInstances` configuration, if any.
     * use the least value of detected above.
  3. otherwise, configure one instance.

## Resource distribution & Entry Point instance auto-configuration

Entry points are expected to be set in project `futoin.json` manifest. However,
they can be set and/or tuned in deployment configuration as well.

Please note that "Application Entry Point" != "Application Instance". The first one generally defines
application, the second one is automatically derived & auto-configured in deployment based
on actual resource & configuration constraints.

Based on overall resource limits per deployment, the resources are automatically distributed across
entry points based on the following constraints:

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
* `.maxTotalMemory` - maximal memory for all instances (for very specific cases)
* `.maxInstances` - limit number of instances per deployment
* `.socketTypes` = ['unix', 'tcp', 'tcp6'] - supported listen socket types
* `.socketProtocol` = one of ['http', 'fcgi', 'wsgi', 'rack', 'jsgi', 'psgi']
* `.debugOverhead` - extra memory per instance in "dev" deployment
* `.debugConnOverhead` - extra memory per connection in "dev" deployment
* `.socketType` - generally, for setup in deployment config
* `.socketPort` - default/base port to assign to service (optional)
* `.maxRequestSize` - maximal size of single request (mostly applicable to HTTP request)

*Note: each tool has own reasonable defaults which can be tunes per entry point.*

## Zero-downtime deployment approach

This approach is used for classical, container and development deployments.
However, actual zero-downtime benefit is assumed for "classical" non-container
production case.

Step-by-step:

* a clean target folder is required for safety reasons due to automatic cleanup,
* deploy lock is taken on target folder,
* target package:
  * if `devserve` is used, the actual working copy is symlinked
  * if `vcsref` or `vcsref` then local VCS cache is maintained for bandwidth efficiency
  * otherwise, last used RMS package is cached
* target version auto-detection:
  * if `vcsref` is used then the latest revision is always used.
  * if precise version is set - it is used for deployment
  * if partial package mask is set - it is used with shell-like match filtering
  * for `rms` a list of available packages is retrieved efficient way
  * for `vcstag` a list of available tags is retrieved efficient way
  * the retrieved list of candidates is sorted in natural order (decimal numbers are assumed)
  * the latest one (greatest by order) is used
* persistent data:
  * `persistent` configuration is used to setup read-write persistent paths.
  * read-write location root is set to `{deployment root}/persistent/` by default.
  * if specified file or directory exists in package, it is forcibly copied to read-write location (!).
  * otherwise, a folder is created in read-write location with symlink from target folder.
  * it's expected that persistent folder is subject for backup procedures.
* a temporary folder under deployment root is used,
* the actions are executed:
  * actions can be hooked both in project and deployment configuration:
    * `.actions` is a map of named actions to string or list of commands.
    * Standard actions match some of command names: "prepare", "build", "migrate", etc.
    * `@cid` in the beginning of command is treated as CID invocation. Example: `@cid build-dep openssl`
    * `@default` as command executes the default behavior. For deployment config it executes project-specified action configuration.
    * If command matches any of other defined actions then it is executed with recursion of this logic.
    * *Note: there is recursion protection other than program stack size.*
    * See `cid deploy set action` for easy scripting instead of direct JSON manipulations.
  * if VCS deployment or forced with `--build` option
    * `cid prepare` - suitable for extra setup
    * `cid build`
  * `cid migrate` - suitable for auto-configuration & database migrations
* all files and directories are set read-only for security & data safety purposes (enforce persistent locations),
* temporary folder is renamed to package name without extension, VCS tag or VCS branch with revision name,
* `current` symlink is set to above,
* if running `cid service master` is detected then it is refreshed,
  * *note: very slight delay may occur which expected to be smoothed by load balancer*?
* deployment folder is cleaned out of any not expected files and folder (cleanup of old versions & misc.),
  * *note: there are some extra files & folders like .tmp, .runtime, .futoin-deploy.lock, etc.*,
* deploy lock is released,
* at any point, if something goes wrong the procedure is aborted leaving previous version running as is.


## Containers

CID can be easily used inside [Docker](https://www.docker.com/) or other type of image as
it is cgroup-friendly. Service master mode and port allocation hints completely satisfy 
such use case.

## Services and `systemd`

Services are auto-configured based on entry point configurations. Services can be either 
executed by Service Master (`cid service master`) or through individual service instance
execution (`cid service exec`). Both cases work well with `systemd`.

## Commands

### Migration

This action is **implicitely** executed during deployment. It is provided here for reference
to be overridden in configuration.

* `cid migrate`
    - Runs data migration tasks.
    - Provided for overriding default procedures in scope of deployment procedure.

### Deployment operation

This is common set of commands used for deployment of project from source or build artifacts.

* `cid deploy ...`
    - Common arguments for deploy family of commands:
    - `[--deployDir=<deploy_dir>]` - target folder, CWD by default.
    - `[--runtimeDir=<runtime_dir>]` - target runtime data folder, `<deploy_dir>/.runtime` by default.
    - `[--tmpDir=<tmp_dir>]` - target temporary data folder, `<deploy_dir>/.tmp` by default.
    - `[--limit-memory=<mem_limit>]` - memory limit with B, K, M or G postfix.
    - `[--limit-cpus=<cpu_count>]` - max number of CPU cores to use.
    - `[--listen-addr=<address>]` - address to use for IP services
    - `[--user=<user>]` - user name to run services.
    - `[--group=<group>]` - group name to run services.
* `cid deploy setup`
    - Prepare directory for deployment. Allows adjusting `futoin.json`
    before actual deployment is done to define limits once or add
    project settings overrides. Allows adjusting settings for next
    deployment. Not necessary otherwise.
* `cid deploy vcstag [<vcs_ref>] [--vcsRepo=<vcs_repo>] [--redeploy]`
    - Deploy from VCS tag.
* `cid deploy vcsref <vcs_ref> [--vcsRepo=<vcs_repo>] [--redeploy]`
    - Deploy from VCS branch.
* `cid deploy rms <rms_pool> [<package>] [--rmsRepo=<rms_repo>] [--build]`
    - Deploy from RMS.

### Deployment configuration

Configuration overriding in deployment target folder is supported. Primary case
is for CID-unaware projects. It's possible to do with direct manipulation of `futoin.json`.

However, the commands below much better suit for scripts then direct manipulation.
Please check [Examples section](/docs/cid/example/).
    
* `cid deploy set ...`
    - Common arguments for "deploy set" family of commands:
        - [--deployDir=<deploy_dir>] - target folder, CWD by default.
* `cid deploy set tools <tools>...`
    - Overrides .tools in deployment config.
* `cid deploy set tooltune <tool> {<set_name=value>...|<del_name>|<inline_json>}`
    - Override .toolTune in deployment config.
* `cid deploy set action <name> <actions>...`
    - Override .action in deployment config.
* `cid deploy set persistent <paths>...`
    - Add .persistent paths in deployment config.
* `cid deploy set entrypoint <name> <tool> <path> {<set_name=value>...|<del_name>|<inline_json>}`
    - Set entry point configuration in deployment.
* `cid deploy set env <variable> [<value>]`
    - Set or remote environment config .env entries.
* `cid deploy set webcfg <variable> [<value>]`
* `cid deploy set webcfg mounts <route>[=<app>]`
    - Set or remove .webcfg entries.
* `cid deploy set webmount <web_path> [<json>]`
    - Set complex web mount point configuration.
* `cid deploy reset [<set_type>]`
    - Reset related configuration to initial state.
    - Use any known "deploy set" type in place of `<set_type>`.
    - Useful for automation to ensure a clean state.

### Service execution

This service execution commands are designed for production use.
Please use `cid devserve` for development.

* `cid service ...`
    - Service execution helpers common arguments:
    - `[--deployDir=<deploy_dir>]` - target folder, CWD by default.
* `cid service master [--adapt [*generic deploy options*]]`
    - Re-balance services, if `--adapt`.
    - Run all entry points as children.
    - Restarts services on exit.
    - Has 10 second delay for too fast to exit services.
    - Supports SIGTERM for clean shutdown.
    - Supports SIGHUP for reload of service list & the services themselves.
* `cid service list [--adapt [*generic deploy options*]]`
    - Re-balance services, if `--adapt`.
    - List services in the following format:
      `<entry point> <TAB> <instance ID> <TAB> <socket type> <TAB> <socket address>`
* `cid service exec <entry_point> <instance_id>`
    - Helper for system init to execute pre-configured service.
* `cid service stop <entry_point> <instance_id> <pid>`
    - Helper for system init to gracefully stop pre-configured service.
* `cid service reload <entry_point> <instance_id> <pid>`
    - Helper for system init to gracefully reload pre-configured service.
    - Note: if reload is not supported then reload acts as "stop" to force restart.

### Execution in Development

The ultimate goal is to provide the same execution environment as in production.
Otherwise, it's quite often appears that projects work well with so-called
"development servers", but appear to be not ready for proper web servers like "nginx".

At the moment, `cid devserve` is not related to `cid build` procedure. Therefore, the
commands must be called independently. Incremental builds may get native support as well.

* `cid devserve [--wcDir=<wc_dir>] [*generic deploy options*]`
    - Run as closely to production deployment as possible.
    - Create temporary deployment directory and use working directory as "current".
    - Re-balance services.
    - Then act like `cid service list` and `cid service master`.

    
