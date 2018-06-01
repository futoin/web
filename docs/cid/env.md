---
path: /docs/cid/env/
---

# CID Environment

"Environment" can refer to type of execution conditions or to environment variables.

## Environment type

There are the following environments configured with `.env.type` which affect CID
and tools behavior.

* `prod` - production (deployment)
* `test` - QA (deployment) & CI
* `dev` - development (default)

For example, environment type affects memory distribution for entry point to allow
debugging overhead. Many tools like `node` and `ruby` set corresponding `NODE_ENV`
and `RUBY_ENV`/`RAILS_ENV`.

## Tool environment variables

CID supports adjusting tool plugin defaults through special environment variables
which are listed in `cid tool describe ${tool}`.

Such variables can be set in shell before execution or in global, user and deployment
configurations for persistency.

By convention, it's possible to adjust tool location through `${tool}Bin`
and tool version through `${tool}Ver` variables. There are many other tool-specific variables.

Example:

<div class="cli-highlight"><pre>
<span class="cli-cmd">$ cid tool exec node -- --version</span>
<span class="cli-info">Exec: /home/user/.nvm/versions/node/v8.11.2/bin/node --version</span>
v8.11.2
<span class="cli-cmd">$ nodeVer=6 cid tool exec node -- --version</span>
<span class="cli-info">Exec: /home/user/.nvm/versions/node/v6.12.2/bin/node --version</span>
v6.12.2
<span class="cli-cmd">$ nodeVer=10 cid tool exec node -- --version</span>
<span class="cli-info">Exec: /home/user/.nvm/versions/node/v10.1.0/bin/node --version</span>
v10.1.0
</pre></div>

## Special CID process environment variables

There a few very special process environment variables which are discouraged to be used on regular basis.

1. `export CID_INTERACTIVE_SUDO=1` - enable interactive `sudo` calls.
1. `export CID_COLOR=no` - disable color output even on capable terminals.
1. `export CID_DEPLOY_HOME=` - override `$HOME` detection during deployment.
1. `export CID_SOURCE_DIR=` - very special variable to use during development
    with `pip -e` local installation.


