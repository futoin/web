---
path: /docs/cid/usecases/
---

# Typical Use Cases

## 1. Prepare project for development:

```bash
cid prepare master --vcsRepo=git:user@host:git/repo.git
# create VCS working copy with specified VCS ref
# auto-detects tools and executes:
#  npm install, composer install, bundle install, etc.
```
    
## 2. Prepare project for release:

```bash
cid tag master
# updates auto-detected files like package.json
# creates tags
# "patch" version increment is the default behavior
```

## 3. Release builds on CI server:

```bash
cid ci_build v1.0.0 Releases --vcsRepo=git:user@host:git/repo.git \
    --rmsRepo=svn:user@host/rms
```

## 4. Nightly builds on CI server:

```bash
cid ci_build master Nightly --vcsRepo=git:user@host:git/repo.git \
    --rmsRepo=scp:user@host
```

## 5. Production-like execution environment in development:

```bash
cid devserve
# PHP-FPM, Ruby rack, Python WSGI, nginx... Doesn't matter - it knows how!
```

## 6. Staging deployment from VCS:

```bash
cid deploy vcsref master --vcsRepo=git:user@host:git/repo.git \
    --deployDir=/www/staging \
    --limit-memory=1G
# See "Resource limits auto-detection" section for more info.
# Public services listen on 0.0.0.0, unless overridden.
# UNIX sockets are preferred for internal communications.
```

## 7. Production deployment from RMS:

```bash
cid deploy rms Releases --rmsRepo=svn:user@host/rms \
    --deployDir=/www/prod \
    --limit-memory=8G \
    --limit-cpus=4
# Auto-detection & distribution of resources as stated above.
# Forced resource limits are preserved per deployment across runs, if not overridden
```

## 8. Alter resource limits before or after deployment:

```bash
cid deploy setup
    --deployDir=/www/prod \
    --limit-memory=16G
```

## 9. Execution of deployed project:

```bash
cid service master --deployDir=/www/prod
```

## 10. Use any supported tool without caring for setup & dependencies:

```bash
cte dockercompose ...
# ensures:
# * setup of system Docker
# * setup of virtualenv
# * setup of pip
# * setup of docker-compoer via pip into virtualenv
# actually, executes
```
