---
path: /docs/cid/dev/
---

# CID in Development

> It is assumed FutoIn CID installation is complete as discussed before.

## Commands for development

Below is incomplete list of primary commands used in development.

### Standard pipeline

This commands can be executed directly in development. For CI, please use
`cid ci_build` instead.

* `cid prepare [<vcs_ref>] [--vcsRepo=<vcs_repo>] [--wcDir=<wc_dir>]`
    - Retrieved the specific `<vcs_ref>`, if provided.
    - `--vcsRepo` is required, if not run in VCS working copy.
    - Action depends on detected tools:
        - clean up the project tree
        - retrieve external dependencies
* `cid build [--debug]`
    - Action depends on detected tools.
    - Runs tool-specific build/compilation.
    - Some multi-functional tools may require extra configuration to
      support build.
* `cid check [--permissive]`
    - Action depends on detected tools.
    - Runs tool-specific test/validation.
    - Some multi-functional tools may require extra configuration to
      support build.
* `cid package`
    - Action depends on detected tools.
    - Runs tool-specific packaging.
    - If package is not found then `futoin.json:.package` folder is put into TAR archive.

*NOTE: `<vcs_repo>` has format of `<tool>:<url>`.*
    
### Release procedures

There are essential parts: source code tagging, binary artifact building and
optional binary artifact upload to Release Management System.

* `cid tag <branch> [<next_version>] [--vcsRepo=<vcs_repo>] [--wcDir=<wc_dir>]`
    - Ensure the latest revision of the `<branch>` is used.
    - Update source for release (versions, changelog, etc.) and commit.
    - Create tag.
    - `<next_version>` can be 'major', 'minor', 'patch' (default) or
      exact version in SEMVER format (http://semver.org/).
* `cid ci_build <vcs_ref> [<rms_pool>] [--vcsRepo=<vcs_repo>]`
    - Perform a clean CI build: retrieve from VCS, prepare, build,
      check, package and optionally push to RMS.
    - The command automatically distinguishes CI and Release builds with slightly different
      behavior for package naming.
* `cid promote <rms_pool> <packages>... [--rmsRepo=<rms_repo>]`
        Promote package to Release Management System (RMS) or manage
        package across RMS pools.

### Other commands

These are auxiliary commands which may be helpful in operation.

* `cid run <command>`
    - Run named command from `futoin.json:.actions`.
    - Quite helpful for command project-specific maintenance tasks.
* `cid build-dep [<build_dep>...]`
    - Require specific development files to be installed, e.g.: openssl, mysqlclient,
      postgresql, imagemagick, etc.
    - Without parameters lists available deps.
* `cid tool ...`
    - Family of commands for management, querying and execution of tools.

## Examples:

Just as example, let's use [Vue.js documentation source](https://github.com/vuejs/vuejs.org).
It is a maintained real-world example which suits here well.

### 1. Getting project to work on

*NOTE: As we have a clean system, CID installs all required tools including Git, nvm, Node.js and yarn.*

By default, CID uses the latest stable versions of tools unless overriden by configuration.

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid prepare master --vcsRepo=git:https://github.com/vuejs/vuejs.org.git --wcDir=vuejs_org</span>
<span class="cli-warn">WARNING: Auto-installing required "git" tool</span>
<span class="cli-info">Call: sudo -n -H /usr/bin/apt-get install -y --no-install-recommends -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold git</span>
<span class="cli-info">Changing to: /home/vagrant/vuejs_org</span>
<span class="cli-info">INFO: Getting source ref master from https://github.com/vuejs/vuejs.org.git</span>
<span class="cli-info">Call: /usr/bin/git clone -q https://github.com/vuejs/vuejs.org.git /home/vagrant/vuejs_org</span>
<span class="cli-info">Call: /usr/bin/git checkout -q master</span>
<span class="cli-info">Call: /usr/bin/git branch -q --set-upstream-to origin/master</span>
<span class="cli-info">Call: /usr/bin/git rebase origin/master</span>
<span class="cli-warn">WARNING: Auto-installing required "nvm" tool</span>
<span class="cli-info">Call: /bin/bash --noprofile --norc -c "git clone https://github.com/creationix/nvm.git /home/vagrant/.nvm;                cd /home/vagrant/.nvm && git fetch && git reset --hard && git checkout $(git describe --abbrev=0 --tags --match \"v[0-9]*\" origin/master)"</span>
Cloning into '/home/vagrant/.nvm'...
remote: Counting objects: 7088, done.
remote: Total 7088 (delta 0), reused 0 (delta 0), pack-reused 7087
Receiving objects: 100% (7088/7088), 2.18 MiB | 426.00 KiB/s, done.
Resolving deltas: 100% (4444/4444), done.
Note: checking out 'v0.33.11'.
<span></span>
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.
<span></span>
If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:
<span></span>
  git checkout -b <new-branch-name>
<span></span>
HEAD is now at 93990ab... v0.33.11
<span class="cli-warn">WARNING: Auto-installing required "node" tool</span>
<span class="cli-info">Call: /bin/bash --noprofile --norc -c "source /home/vagrant/.nvm/nvm.sh --no-use && nvm install lts/*"</span>
Downloading https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-x64.tar.xz...
--2018-05-31 15:26:59--  https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-x64.tar.xz
Resolving nodejs.org (nodejs.org)... 104.20.23.46, 104.20.22.46, 2400:cb00:2048:1::6814:162e, ...
Connecting to nodejs.org (nodejs.org)|104.20.23.46|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 11349944 (11M) [application/x-xz]
Saving to: ‘/home/vagrant/.nvm/.cache/bin/node-v8.11.2-linux-x64/node-v8.11.2-linux-x64.tar.xz’
<span></span>
/home/vagrant/.nvm/.cache/bin/node-v8.11. 100%[=====================================================================================>]  10.82M  1.99MB/s    in 5.8s
<span></span>
2018-05-31 15:27:05 (1.87 MB/s) - ‘/home/vagrant/.nvm/.cache/bin/node-v8.11.2-linux-x64/node-v8.11.2-linux-x64.tar.xz’ saved [11349944/11349944]
<span></span>
Computing checksum with sha256sum
Checksums matched!
<span class="cli-warn">WARNING: Auto-installing required "yarn" tool</span>
<span class="cli-info">Call: /home/vagrant/.nvm/versions/node/v8.11.2/bin/npm install -g yarn</span>
<span class="cli-info">INFO: Running "prepare" in tools</span>
<span class="cli-info">Call: /home/vagrant/.nvm/versions/node/v8.11.2/bin/yarn install --production=false</span>
</pre></div>

### 2. Starting development server AS-IS

The project's npm configuration already provide development web server support.
Let's run it with `cid tool exec <tool> [<ver>] -- [<args>]` command. This gives you
hint how to operate any tool through CID.

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cd vuejs_org </span>
<span class="cli-cmd">$ cid tool exec npm -- start </span>
<span class="cli-info">Exec: /home/vagrant/.nvm/versions/node/v8.11.2/bin/npm start</span>
<span></span>
&gt; vuejs.org@ start /home/vagrant/vuejs_org
&gt; hexo server
<span></span>
INFO  Start processing
INFO  Hexo is running at http://localhost:4000. Press Ctrl+C to stop.
</pre></div>

### 3. Running commands in correct environment

CID intentionally does not pollute root shell environment to avoid possible interference of
different incompatible tools and their versions.

However, you may want to run commands with environment of some tool.
Let's run `hexo` directly with `cid tool envexec <tool> [<ver>] -- <cmd> [<args>]`.

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tool envexec npm -- ./node_modules/.bin/hexo server </span>
<span class="cli-info">Exec: ./node_modules/.bin/hexo server</span>
INFO  Start processing
INFO  Hexo is running at http://localhost:4000. Press Ctrl+C to stop.
</pre></div>

### 4. Updating locally installed tools

CID installs/updates required tools only when the tool or required version is missing.
We can force upgrade of all tools or individual tool.

More about that is in [dedicated section](/docs/cid/tools/).

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tool update </span>
<span class="cli-info">Call: /home/vagrant/.nvm/versions/node/v8.11.2/bin/npm update -g yarn</span>
<span class="cli-info">Call: /bin/bash --noprofile --norc -c "source /home/vagrant/.nvm/nvm.sh --no-use && nvm install lts/*"</span>
v8.11.2 is already installed.
<span class="cli-info">Call: /home/vagrant/.nvm/versions/node/v8.11.2/bin/npm update -g npm</span>
<span class="cli-info">Call: /bin/bash --noprofile --norc -c "cd /home/vagrant/.nvm && git fetch && git reset --hard && git checkout $(git describe --abbrev=0 --tags --match \"v[0-9]*\" origin/master)"</span>
HEAD is now at 93990ab... v0.33.11
</pre></div>

### 5. Release process

Release process is demonstrated based on [futoin-request](https://github.com/futoin/util-js-request) Node.js module.

First, tagging:

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tag master </span>
<span class="cli-info">INFO: Getting source branch master from git@vcsrepo:futoin/util-js-request.git
Call: /usr/bin/git fetch -q
Call: /usr/bin/git checkout -q master
Call: /usr/bin/git branch -q --set-upstream-to origin/master
Call: /usr/bin/git rebase origin/master
INFO: Updating files for release
INFO: Committing updated files
Call: /usr/bin/git add futoin.json package.json CHANGELOG.txt
Call: /usr/bin/git commit -q -m "Updated for release futoin-request 1.0.2" futoin.json package.json CHANGELOG.txt
INFO: Creating a tag v1.0.2
Call: /usr/bin/git tag -a -m "Release futoin-request 1.0.2" v1.0.2
INFO: Pushing changes to git@vcsrepo:futoin/util-js-request.git
Call: /usr/bin/git -c push.default=current push -q origin master v1.0.2</span>
</pre></div>

Second, let's check the changes:

```patch
# git show
commit d924cedcabadbd42548ad3a42ac9f2f83e12a65c
Author: Andrey Galkin <andrey@futoin.org>
Date:   Thu May 31 20:53:04 2018 +0300

    Updated for release futoin-request 1.0.2

diff --git a/CHANGELOG.txt b/CHANGELOG.txt
index c905738..9270ff2 100644
--- a/CHANGELOG.txt
+++ b/CHANGELOG.txt
@@ -1,4 +1,4 @@
-=== (next) ===
+=== 1.0.2 (2018-05-31) ===
 FIXED: browser entry point to use ES5 version

 === 1.0.1 (2017-12-23) ===
diff --git a/futoin.json b/futoin.json
index 8eacfbe..2e90ef1 100644
--- a/futoin.json
+++ b/futoin.json
@@ -1,6 +1,6 @@
 {
   "name": "futoin-request",
-  "version": "1.0.1",
+  "version": "1.0.2",
   "vcs": "git",
   "rms": "npm",
   "rmsRepo": "ignored",
diff --git a/package.json b/package.json
index 4f91b46..70a2e78 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "futoin-request",
-  "version": "1.0.1",
+  "version": "1.0.2",
   "description": "AsyncSteps friendly wrapper of 'request' package",
   "main": "index.js",
   "browser": "es5/lib/browser.js",
```

Third, release to npm:

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid ci_build v1.0.2 npmjs </span>
<span class="cli-info">Renaming: /lab/ci_builds/util-js-request_v1.0.2 to /lab/ci_builds/util-js-request_v1.0.2.bak1527793044
Changing to: /lab/ci_builds/util-js-request_v1.0.2
INFO: Getting source ref v1.0.2 from git@cfvcs:futoin/util-js-request.git
Call: /usr/bin/git clone -q git@cfvcs:futoin/util-js-request.git /lab/ci_builds/util-js-request_v1.0.2
Call: /usr/bin/git checkout -q v1.0.2
INFO: Running "prepare" in tools
Call: /home/user/.nvm/versions/node/v8.11.2/bin/yarn install --production=false
INFO: Running "build" in tools
Call: /home/user/.nvm/versions/node/v8.11.2/bin/grunt</span>
(node:17867) ExperimentalWarning: The http2 module is an experimental API.
Running "eslint:target" (eslint) task
Running "webpack:dist" (webpack) task
# ...
Done.
<span class="cli-info">INFO: Running "package" in tools
Call: /home/user/.nvm/versions/node/v8.11.2/bin/yarn install --production</span>
yarn install v1.7.0
[1/5] Validating package.json...
[2/5] Resolving packages...
[3/5] Fetching packages...
info fsevents@1.2.4: The platform "linux" is incompatible with this module.
info "fsevents@1.2.4" is an optional dependency and failed compatibility check. Excluding it from installation.
[4/5] Linking dependencies...
[5/5] Building fresh packages...
Done in 2.58s.
<span class="cli-info">Call: /home/user/.nvm/versions/node/v8.11.2/bin/npm pack</span>
# ...
<span class="cli-info">INFO: Found binary artifacts from tools: ['futoin-request-1.0.2.tgz']
INFO: Running "check" in tools
INFO: Promoting to npmjs pool: futoin-request-1.0.2.tgz</span>
<span class="cli-warn">WARNING: Workaround for known "npm publish" tarball issues</span>
<span class="cli-info">Removing: futoin-request-1.0.2.tgz
Call: /home/user/.nvm/versions/node/v8.11.2/bin/npm publish</span>
npm notice
npm notice 📦  futoin-request@1.0.2
npm notice === Tarball Contents ===
npm notice 1.5kB   package.json
npm notice 217B    CHANGELOG.txt
npm notice 2.3kB   index.js
npm notice 11.4kB  LICENSE
npm notice 3.8kB   README.md
npm notice 180.4kB dist/futoin-request.js
npm notice 1.5kB   lib/browser.js
npm notice === Tarball Details ===
npm notice name:          futoin-request
npm notice version:       1.0.2
npm notice package size:  63.3 kB
npm notice unpacked size: 201.1 kB
npm notice shasum:        524290f52cf2ef82fa20b44951149c401bfa2135
npm notice integrity:     sha512-02c8Q4sKXcJg6[...]wEZomvm/ECx6Q==
npm notice total files:   7
npm notice
+ futoin-request@1.0.2
</pre></div>

Typically, the last step should be done by CI server.
