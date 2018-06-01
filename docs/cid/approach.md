---
path: /docs/cid/approach/
---

# CID approach

> FutoIn CID mimics what real human would do to start working on or for deploying
some arbitrary project.

## How it is done with README

Going back in the past, Developers and SysAdmins used to follow `README` or similar
step-by-step environment preparation and application installation guides. 

All such guidelines have quite common parts:

1. Setup tools.
1. Checkout from VCS or download & unpack binary artifact.
1. (Optional) Run tools to install dependencies and build the project.
1. Project-specific configuration steps.
1. Setup system services to execute the project.
1. (Optional) Setup of web server.

It was quite time consuming and error-prone. Infrastructure provisioning required custom coding for
each case. Nowadays, containers mostly hide the problem of manual setup at cost
of infrastructure complexity and some disadvantages like significantly increased network
usage on image rebuild, lack of live-reload by design or still requirement for manual
setup of host environment for development tools.

**CID goes this route, if there is tool and action configuration in `futoin.json`**.

## How it is done without README

Many projects lack proper in-depth `README`. Engineers have to analyze
source code or package to understand what technology is used and what are
common technology-specific steps to get the project up and running.

**CID does exactly the same**: unless there is a complete tool configuration in optional `futoin.json`
file, FutoIn CID tries to auto-detect tools based on well-known files. For example, Git would be
detected based on `.git` folder, npm would be detected based on `package.json`, Composer would be
detected based on `composer.json` and so on. Based on build tools, it's possible to deduce what
kind of runtime environment has to be used.

Complex real-world scenario requires some hints and CID supports them through deployment
configuration overrides. To be discussed in other sections.


