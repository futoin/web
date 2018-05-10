---
path: /docs/microservices/install/
---

# Invoker & Executor installation

## Node.js & Browser (CommonJS)

CommonJS usage is preferred officially supported method of installation.

```bash
npm install futoin-invoker futoin-executor
# or
yarn add futoin-invoker futoin-executor
```

### Usage

For Node.js v6+:

```javascript
const AdvancedCCM = require('futoin-invoker/AdvancedCCM');
const NodeExecutor = require('futoin-executor/NodeExecutor');
```

For older Node.js and browser:


```javascript
var AdvancedCCM = require('futoin-invoker/es5/AdvancedCCM');
var NodeExecutor = require('futoin-executor/es5/NodeExecutor');
var BrowserExecutor = require('futoin-executor/es5/BrowserExecutor');
```

## Browser standalone (UMD)

Pre-packed UMD builds a available.

```html
<script src="https://unpkg.com/futoin-asyncsteps/dist/polyfill-asyncsteps.js"></script>
<script src="https://unpkg.com/futoin-asyncsteps/dist/futoin-asyncsteps.js"></script>
<script src="https://unpkg.com/futoin-asyncevent/dist/polyfill-asyncevent.js"></script>
<script src="https://unpkg.com/futoin-asyncevent/dist/futoin-asyncevent.js"></script>
<script src="https://unpkg.com/futoin-invoker/dist/futoin-invoker.js"></script>
<script src="https://unpkg.com/futoin-executor/dist/futoin-executor.js"></script>

```

Invoker and Executor should be available as the following globals:

* `window.futoin.SimpleCCM`
* `window.futoin.AdvancedCCM`
* `window.futoin.Invoker`
* `window.futoin.BrowserExecutor`


## PHP

At the moment, PHP version complies to older spec versions.

```bash
composer require 'futoin/core-php-ri-invoker'
composer require 'futoin/core-php-ri-executor'
```

Usage:

```php
use \FutoIn\RI\AdvancedCCM;
use \FutoIn\RI\Executor;
```
