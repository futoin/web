---
path: /docs/cid/
---

# CID: Continuous Integration & Delivery tool

There are plenty of solutions for build and deployment automation, but there
is no such other advanced conceptual meta-tool as FutoIn CID yet.

> For mono-technology developers, it's usually not a problem to have tailored
development environment, but such approach is not acceptable with grow of
experience, project count and tool set due to unavoidable human mistakes.

As with any other conceptual FutoIn project, it has a dedicated specification: [FTN16][].
Source code mirror is available on [GitHub](https://github.com/futoin/cid-tool).

Even though primary focus is on web projects, FutoIn CID fits well into more classical SDLC.

*Hints: **VCS** states for Version Control System and **RMS** states for Release Management System.*

## For **development**, CID solves:

1. Setup and control of environment: management of auto-detected tools and their versions.
1. Preparation of project for build: installation of dependencies using auto-detected tools.
1. Build of projects with auto-detected tools.
1. Execution which mimics production deployment on minimal scale.
1. Automated preparation for release and VCS tagging of projects.
1. Helpers for direct tool invocation in correctly setup environment.
1. Advanced description of application entry points and neutral web server configuration.

## For optional **CI** process, CID solves:

1. Choosing VCS ref, checkout, build, test and upload to RMS pipeline in one command.
1. Helpers for VCS-agnostic manipulations: merging, committing changes, retrieving information, etc.
1. Helpers for RMS-agnostic manipulations: promoting and listing of artifacts.

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
1. External to project advanced CID configuration in place of deployment -
   even CID-unaware source can be used.


[FTN16]: https://specs.futoin.org/final/preview/ftn16_cid_tool.html
