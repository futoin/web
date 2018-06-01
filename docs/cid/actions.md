---
path: /docs/cid/actions/
---

# CID Actions

Almost any project has some maintenance tasks which require execution
of commands in sequence and/or with some parameters. They are called
"actions" in CID terminology.

There are two types of actions:

* Standard: prepare, build, check, package, migrate
* Custom: any user defined

The standard action types have default actions defined by detected tools.
It's possible to override or to extend such actions.

## Configuration

All type of actions can be configured in `.actions` entry of `futoin.json`
as string or array of strings.

Array of strings are executed as individual commands in the same sequence
as they are defines.

Any arguments passed on command line are appended to each action definition.

### Special variables

If action definition starts with `@cid`, it means reference to CID itself
to be executed efficient and platform-neutral way.

A special `@default` placeholder can be used to execute the default action.
In deployment configuration it also means to execute original action definition
from project configuration.

### Complex example

```json
{
  "actions": {
    "upgrade-deps": [
      "@cid tool update",
      "@cid tool exec yarn -- upgrade --latest"
    ],
    "check": [
      "@cid tool envexec node -- sh -c \"test $NODE_ENV != production\"",
      "@default"
    ],
    "qa-test": "@cid tool envexec node -- ./test/run_test.sh",
    "prod-test": "@cid tool envexec node -- ./test/run_prod.sh",
    "tag-prod": [
      "sh -c '[ -n \"$1\" ] || ( echo Missing tag name; exit 1 )' --",
      "sh -c 'git tag $1-prod $1' -- ",
      "sh -c 'git push -u origin $1-prod' --"
    ]
  }
}
```

## Commands

Action can be executed with `cid run` command.

For example:

* `cid run upgrade-deps` - custom maintenance task
* `cid run tag-prod v1.2.3` - custom task with parameter
* `cid check` or `cid run check` - standard action
