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

## 3. Configuration in deployment based on Redmine example

```bash
# select deploy root
DEPLOY_DIR=/target-empty-dir-or-existing-deployment
mkdir $DEPLOY_DIR
cd $DEPLOY_DIR

# initialize with safety placeholders first
cid deploy setup 

# require Ruby 2.3 instead of latest
cid deploy set env rubyVer '2.3'

# hook standard prepare action
cid deploy set action prepare app-config database-config app-install

# set custom-named actions for easy management
cid deploy set action app-config \
    'cp config/configuration.yml.example config/configuration.yml' \
    'rm -rf tmp && ln -s ../.tmp tmp'

# assume, database config is put in deploy root (after 'cid deploy setup')
cid deploy set action database-config \
    'ln -s ../../.database.yml config/database.yml'
cat >.database.yml <<EOT
production:
    adapter: mysql2
    database: redmine
    host: localhost
    username: redmine
    password: redmine
    encoding: utf8
EOT
    
# Standard Redmine HOWTO:
cid deploy set action app-install \
    '@cid build-dep ruby mysql-client imagemagick tzdata libxml2' \
    '@cid tool exec bundler -- install --without "development test"'

# hook standard migrate action
cid deploy set action migrate \
    '@cid tool exec bundler -- exec rake generate_secret_token' \
    '@cid tool exec bundler -- exec rake db:migrate RAILS_ENV=production' \
    '@cid tool exec bundler -- exec rake redmine:load_default_data RAILS_ENV=production REDMINE_LANG=en'

# Add persistent locations
cid deploy set persistent  files log

# Configure entry points
cid deploy set entrypoint  web nginx public socketType=tcp
cid deploy set entrypoint  app puma config.ru internal=1

# Configure web paths
cid deploy set webcfg root public
cid deploy set webcfg main app
cid deploy set webmount '/' '{"static": true}'
```
