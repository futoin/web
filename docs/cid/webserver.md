---
path: /docs/cid/webserver/
---

# WebServer configuration

The primary focus of CID is on continuous integration and delivery of web projects.
Therefore, advanced web server integration is one of primary aspects.

CID is focused on `nginx`, but the configuration is neutral.

## Configuration

Configuration root is `.webcfg` node of `futoin.json`.

* `.webcfg.root` - web root folder relative to project root.
* `.webcfg.main` - default index handler entry point name.
* `.webcfg.mounts - {}` - path prefix to details in form of:
    - string - name of related entry point.
    - map - advanced config:
        - `.app` - name of related entry point,
        - `.static = false` - try to serve static files, if true,
        - `.tune = {}` - fine options:
            - `.pattern = true` - enable other options based on pattern match
            - `.staticGzip = true` - try to use pre-compressed "*.gz" files
            - `.gzip = false` - compress in transmission
            - `.expires = 'max'` - add expires header
            - `.autoindex = false` - enable auto-indexing
            - `.index = 'index.html'` - default index file
            - `.etag = false` - enable ETag

### Mount point

In current specification, mount point is assumed to be location as defined
in `nginx` or `apache`. However, mount point cannot have own file system path.

#### `.static` mount point option

This option allows serving static files from `.webcfg.root`, if they match
the mount point.

The default value is `true`, unless `.app` is set.

#### `.tune.pattern` tune option

Pattern matching automatically configures web server to use proper compression
and headers approach for files based on extension type.

#### `.tune.staticGzip` tune option

Forcibly enables using pre-compressed `*.gz` files instead of spending CPU cycles.

#### `.tune.gzip` tune option

Controls if gzip compression can be used, if supported by HTTP client.

#### `.tune.expires` tune option

Web server specific value to control `Expires` and cache control headers.

#### `.tune.autoindex` tune option

Enables automatic indexing of folders without index file and/or associated entry point.

#### `.tune.index` tune option

Sets default index file name.

#### `.tune.etag` tune option

Controls `ETag` and related header support.

## Development execution

Previously described `cid devserve` command almost completely mimics production
environment without any need to setup local development web server.

## Complex example

This configuration is focused on `nginx` with some fine lookup optimizations.
CID does not enforce routes validation - they are passed to tool configuration as is.

```json
{
  "entryPoints": {
    "backend": {
      "tool": "node",
      "path": "server.js",
      "tune": {
        "internal": true,
        "scalable": false
      }
    },
    "frontend": {
      "tool": "nginx",
      "path": "webroot",
      "tune": {
        "cid": {
          "serveStatic": true
        },
        "config": {
          "http": {
            "server": {
              "rewrite '^/([a-z]{2})/$'": "/index.$1.html last",
              "location = /": {
                "return": "302 /en/"
              }
            }
          }
        }
      }
    }
  },
  "webcfg": {
    "root": "webroot",
    "mounts": {
      "/": {
        "tune": {
          "pattern": false,
          "gzip": true,
          "staticGzip": true
        }
      },
      "^~ /api/": "backend",
      "^~ /img/": {
        "tune": {
          "pattern": false
        }
      },
      "^~ /fonts/": {
        "tune": {
          "pattern": false
        }
      },
      "^~ /icons-": {
        "tune": {
          "pattern": false
        }
      },
      "~ \"^/index\\.[a-z]{2}\\.html$\"": {
        "tune": {
          "pattern": false,
          "gzip": true,
          "staticGzip": true,
          "expires": "epoch"
        }
      }
    }
  }
}
```

