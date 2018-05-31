---
path: /docs/cid/install/
---

# CID installation

Current FutoIn CID implementation is written in Python and
is available as [futoin-cid][] package on PyPI.

It can be installed with standard PIP tool:

```bash
$ pip install futoin-cid
```

If pip is not available then it's strongly suggested to install one first:

```bash
# Debian-based
$ apt install python-pip

# RPM-based
$ yum install python-pip
# or
$ dnf install python-pip

# Others with Python setuptools available
$ easy_install pip
```

[futoin-cid]: https://pypi.org/project/futoin-cid/

## OS preparation

This step is not strictly needed. CID will suggest to install
required system packages on demand. However, for best user experience a very
restricted set of `sudo` commands should be allowed.

The general approach to setup the list of commands:

``` bash
$ cid sudoers | sudo tee -a /etc/sudoers
```

If your OS supports `/etc/sudoers.d` folder then the following approach is better:

``` bash
$ cid sudoers | sudo tee /etc/sudoers/cid_$(id -un)
```

*NOTE: only the approach can be safely repeated (e.g. after CID upgrade) as it overwrites dedicated file.*

If you are concerned about security, but still want to allow verified
system package installation then add `--skip-key-management` option like:

``` bash
$ cid sudoers --skip-key-management | sudo tee /etc/sudoers/cid_$(id -un)
```

## Alternative to OS preparation

By default, CID uses non-interactive `sudo` calls to avoid hanging automated tasks.
If you want to be able to input `sudo` password instead of just whitelisting the commands
then you can set the following environment in shell.

```bash
export CID_INTERACTIVE_SUDO=1
```

## Integration into provisioning systems

A very advanced level of privileged command execution is `.env.externalSetup` configuration
which is out of scope of this guide.
