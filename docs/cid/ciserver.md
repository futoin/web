---
path: /docs/cid/ciserver/
---

# CID on CI Server

There are many well-known CI services and similar solutions. Their fundamental
problem is complete stop of processing on service failure with almost no option
for manual operation of critical pipeline while service is restoring. It's also
more difficult to debug operation problems.

FutoIn CID has a different approach. All CI tasks are assumed to be self-sufficient
to be operated in manual mode for initial setup, debug and recovery. CI service
is considered an extra feature on top. Therefore, FutoIn CID well integrates
into almost any CI service with no extra plugins needed.

## Commands

The primary feature is `ci_build` command which has been already [described before](/docs/cid/dev/#release-procedures). It implicitly executes `cid prepare`, `cid build`, `cid check` and `cid package` in clean way.

In addition, CID supports the following VCS abstractions:

* `cid vcs ...`
    - Family of abstract VCS helpers for CI environments & scripts.
    - They are quite limited for daily use.
* `cid vcs checkout [<vcs_ref>] [--vcsRepo=<vcs_repo>] [--wcDir=<wc_dir>]`
    - Checkout specific VCS ref.
* `cid vcs commit <commit_msg> [<commit_files>...] [--wcDir=<wc_dir>]`
    - Commit all changes or specific files with short commit message.
* `cid vcs merge <vcs_ref> [--no-cleanup] [--wcDir=<wc_dir>]`
    - Merge another VCS ref into current one. Abort on conflict.
    - Automatic cleanup is done on abort, unless --no-cleanup.
* `cid vcs branch <vcs_ref> [--wcDir=<wc_dir>]`
    - Create a new branch from current checkout VCS ref.
* `cid vcs delete <vcs_ref> [--vcsRepo=<vcs_repo>] [--cacheDir=<cache_dir>] [--wcDir=<wc_dir>]`
    - Delete branch.
* `cid vcs export <vcs_ref> <dst_dir> [--vcsRepo=<vcs_repo>] [--cacheDir=<cache_dir>] [--wcDir=<wc_dir>]`
    - Export VCS ref into folder.
* `cid vcs tags [<tag_pattern>] [--vcsRepo=<vcs_repo>] [--cacheDir=<cache_dir>] [--wcDir=<wc_dir>]`
    - List tags with optional pattern for filtering.
* `cid vcs branches [<branch_pattern>] [--vcsRepo=<vcs_repo>] [--cacheDir=<cache_dir>] [--wcDir=<wc_dir>]`
    - List branches with optional pattern for filtering.
* `cid vcs reset [--wcDir=<wc_dir>]`
    - Revert all local changes, including merge conflicts.
* `cid vcs ismerged <vcs_ref> [--wcDir=<wc_dir>]`
    - Check if branch is merged into current branch.
* `cid vcs clean [--wcDir=<wc_dir>]`
    - Remove unversioned files and directories, including ignored.

Additional RMS abstractions help managing binary artifacts in CI jobs:

* `cid rms ...`
    - Abstract RMS helpers for CI environments & scripts.
    - They are quite limited for daily use.
* `cid rms list <rms_pool> [<package_pattern>] [--rmsRepo=<rms_repo>]`
    - List package in specified RMS pool with optional pattern.
* `cid rms retrieve <rms_pool> <packages>... [--rmsRepo=<rms_repo>]`
    - Retrieve package(s) from the specified RMS pool.
* `cid rms pool create <rms_pool> [--rmsRepo=<rms_repo>]`
    - Ensure RMS pool exists. Creates, if missing.
    - It may require admin privileges!
* `cid rms pool list [--rmsRepo=<rms_repo>]`
    - List currently available RMS pools.

## CI service control

Test Automation and Continuous Integration service control interface is planned.


