---
path: /docs/asyncsteps/install/
---

# AsyncSteps installation

## Node.js & Browser (CommonJS)

CommonJS usage is preferred officially supported method of installation.

```bash
npm install futoin-asyncsteps
# or
yarn add futoin-asyncsteps
```

### Usage

For Node.js v6+:

```javascript
const $as = require( 'futoin-asyncsteps' );

$as()
    .add( () => {} )
    .execute();
```

For older Node.js and browser:


```javascript
const $as = require( 'futoin-asyncsteps/es5' );

// the same
```

## Browser standalone (UMD)

Pre-packed UMD builds a available.

```html
<script src="https://unpkg.com/futoin-asyncsteps/dist/polyfill-asyncsteps.js"></script>
<script src="https://unpkg.com/futoin-asyncsteps/dist/futoin-asyncsteps.js"></script>
```

AsynSteps should be available as `$as` / `window.$as` global.


## PHP

At the moment, PHP version complies to older AsyncSteps spec version.

```bash
composer require 'futoin/core-php-ri-asyncsteps'
```

Usage:

```php
use \FutoIn\RI\AsyncSteps;

$root_as = new AsyncSteps();
$root_as->add( function( $as ) {} );
$root_as->execute();
```
