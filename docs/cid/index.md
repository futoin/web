---
path: /docs/cid/
---

# CID: Continuous Integration & Delivery tool

There are plenty of solutions for build and deployment automation, but there
is no such other advanced conceptual meta-tool as FutoIn CID yet. **It's much more
powerful and handy than any "Swiss Army knife" type of tool.**

> For mono-technology developers, it's usually not a problem to have tailored
development environment, but such approach is not acceptable with grow of
experience, active project count and tool set due to unavoidable human mistakes.

As with any other conceptual FutoIn project, it has a dedicated specification: [FTN16][].
Source code mirror is available on [GitHub](https://github.com/futoin/cid-tool) and
[GitLab](https://gitlab.com/futoin/cid-tool).

As this guide does not cover all fine moments yet, please do not hesitate to ask questions in
[FutoIn Helpdesk](https://github.com/futoin/helpdesk).

Even though primary focus is on web projects, FutoIn CID fits well into more classical SDLC.

*Hints: <strong>VCS</strong> states for Version Control System and <strong>RMS</strong> states for Release Management System.*

[FTN16]: https://specs.futoin.org/final/preview/ftn16_cid_tool.html

## For **development**, CID solves:

1. Setup and control of environment: management of auto-detected tools and their versions.
1. Preparation of project for build: installation of dependencies using auto-detected tools.
1. Build of projects with auto-detected tools.
1. Execution which mimics production deployment on minimal scale.
1. Automated preparation for release and VCS tagging of projects.
1. Helpers for direct tool invocation in correctly setup environment.
1. Advanced description of application entry points and neutral web server configuration.

## For optional **CI** process, CID solves:

1. Single command to choose VCS ref, checkout, build, test and upload to RMS pipeline.
1. Helpers for VCS-agnostic manipulations: merging, committing changes, retrieving information, etc.
1. Helpers for RMS-agnostic manipulations: promoting, downloading and listing of artifacts.

## For **deployment**, CID solves:

1. Choosing the latest (filtered) VCS ref or RMS artifact.
1. Rolling deployment of new versions.
1. Rolling migration procedures.
1. Automatic service instance and resource distribution management.
1. Maintaining persistent file data.
1. Shared tool setup for different application users.
1. Integration with provisioning systems.
1. Drop-in integration into containerization solutions.
1. Security enforcements.
1. External to project in place configuration - even CID-unaware projects are supported.


## FutoIn CID supports

### Technologies & tools (so far):

*Note: please use* **cid tool list** *and* **cid tool describe $tool** *for details.*

* **cmake**
* **docker**
  - **docker-compose**
* **flyway**
* **go**
  - **gvm**
* **java** for runtime (uses Zulu JDK unless overridden)
  - **ant**
  - **gradle**
  - **jdk** for development (uses Zulu JDK unless overridden)
  - **maven**
  - **sdkman** for SDK management (besides JRE & JDK)
* **jfrog** - JFrog CLI
* **make**
* **liquibase**
* **nginx** - true web server for development, testing & production
* **node**
  - **npm**
  - **bower**
  - **grunt**
  - **gulp**
  - **nvm** (implicit)
  - **yarn** - uses npm for own install, but disables one for processing
  - **webpack**
* **php** - system, php-build supported and binary builds (Sury, SCL)
  - **composer**
  - **php-build** (implicit)
* **python** - system 2 & 3
  - **virtualenv**, venv is ignored due to issues with *ensurepip* package
  - **pip**
  - **twine** - as limited RMS tool
  - **uwsgi** - to run application behind nginx (or other web server)
* **ruby** - system, rvm supported and binary builds (Brightbox, SCL)
  - **gem**
  - **bundler**
  - **rvm** (implicit)
  - **puma** - to run application behind nginx (or other web server)
* **rust**
  - **rustup**
  - **cargo**
* **scala**
  - **sbt** - Simple Build Tools for Scala


### Version Control Systems (VCS):

* **Git**
* **Mercurial**
* **Subversion**


### Release Management Systems (RMS):

- **archiva** - supporting non-Maven layout through WebDAV.
  - Always tested in standard cycle.
- **artifactory** - only Pro version as OSS is very limited for automation.
  - NOT tested in standard test cycle as JFrog did not provide license for development.
- **nexus** - only v2 as v3 lacks complete REST API yet.
  - Always tested in standard cycle.
- **scp** - SSH-based secure copy.
  - Always tested in standard cycle.
- **svn** - Subversion is quite suitable for Production release builds,
  but please **avoid using it for snapshots**.
  - Always tested in standard cycle.
- **twine** - Upload only to Python Package Index.
  - Promotion between repos is not supported.
- Not implemented, but planned:
  - Nexus v3 - after sane REST API is implemented.

## Tested on the following OSes:

* **AlpineLinux**
  - There are known incompatibilities with glibc-based binaries.
* **ArchLinux**
  - latest
* **CentOS**
  - **7**
* **Debian**
  - **8 - Jessie**
  - **9 - Stretch**
* **Fedora**
  - **25**
* **Gentoo**
  - Well... CID does support emerge, but you are on your own here ;)
    Not included in standard test cycle.
* **macOS**
  - **Sierra**
  - Test hardware is:
* **OpenSUSE**
  - **42.2 Leap**
  - There are known issues with some tools due to lack of community support.
* **Oracle Linux (OL)**
  - **7**
* **RedHat Enterprise Linux (RHEL)**
  - **7**
* **SUSE Linux Enterprise Server (SLES)**
  - **12**
  - *Note: only occasionally tested due to lack of suitable license*
* **Ubuntu**
  - **14.04 LTS - Trusty**
  - **16.04 LTS - Xenial**
  - **17.04 - Zesty**    
* **Other Linux**
  - it should work without issues, if system packages are installed manually.

