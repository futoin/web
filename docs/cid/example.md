---
path: /docs/cid/example/
---

# CID Examples

## 1. This website `futoin.json`

```json
{
  "name": "futoin-website",
  "version": "x.y.z",
  "vcs": "git",
  "plugins": {
    "release": "futoin.cid.misc.releasetool"
  },
  "entryPoints": {
    "frontend": {
      "tool": "nginx",
      "path": "public",
      "tune": {
        "socketPort": 3011
      }
    }
  },
  "webcfg": {
    "root": "public",
    "mounts": {
      "/": {
        "tune": {
          "expires": "epoch",
          "pattern": true,
          "staticGzip": true
        }
      },
      "/favicons/": {
        "tune": {
          "etag": true,
          "expires": "off",
          "pattern": false,
          "gzip": false
        }
      },
      "/static/": {
        "tune": {
          "expires": "max",
          "staticGzip": true
        }
      }
    }
  },
  "actions": {
    "build": [
      "@cid tool exec npm -- run build",
      "@cid tool build gzip"
    ],
    "develop": "@cid tool exec npm -- run develop",
    "upgrade-deps": [
      "@cid tool update",
      "@cid tool exec yarn -- upgrade --latest"
    ]
  }
}
```

## 2. Typical API service `futoin.json`

```json
{
  "name": "api",
  "version": "x.y.z",
  "vcs": "git",
  "vcsRepo": "git@vcsrepo:project/api.git",
  "entryPoints": {
    "backend": {
      "tool": "node",
      "path": "app.js",
      "tune": {
        "internal": true,
        "maxInstances": 2,
        "maxRequestSize": "8K"
      }
    },
    "frontend": {
      "tool": "nginx",
      "path": "web"
    }
  },
  "webcfg": {
    "root": "web",
    "mounts": {
      "/api/": "backend",
      "/": {
        "static": true
      }
    }
  },
  "actions": {
    "upgrade-deps": [
      "@cid tool update",
      "@cid tool exec yarn -- upgrade --latest"
    ],
    "check" : "@cid tool exec grunt -- check",
    "test": [
      "@cid tool envexec node -- sh -c \"test $NODE_ENV != production\"",
      "@cid tool exec grunt -- test"
    ]
  }
}
```
