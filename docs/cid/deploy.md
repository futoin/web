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

## Resource limits & distribution

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

## Containers

CID can be easily used inside [Docker](https://www.docker.com/) or other type of image as
it is cgroup-friendly. Service master mode and port allocation hints completely satisfy 
such use case.

## Services

Services are auto-configured based on entry point configurations. Services can be either 
executed by Service Master (`cid service master`) or through inidividual service instance
execution (`cid service exec`).

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

When FutoIn CID unaware project is used for deployment, it's possible to provide configuration
in deployment target folder. It's possible to do with direct manipulation of `futoin.json`.

However, the commands below much better suit for scripts then direct manipulation.
    
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
    
