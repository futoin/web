---
path: /docs/eventstream/install/
---

# EventStream Installation

## For Node.js

The reference implementation is available as
[futoin-eventstream](https://www.npmjs.com/package/futoin-eventstream) npm module.

Command line:
```sh
$ yarn add futoin-eventstream 
```
or

```sh
$ npm install futoin-eventstream --save
```

### Usage with Database-bound events

```javascript
const { DBServiceApp } = require( 'futoin-eventstream/DBServiceApp' );

// Initialize database interfaces with "evt" name
DBAutoConfig( as, ccm, {
    evt: {},
} );

// Initialize rquired services
const evtApp = new DBEvtServiceApp( as, { ccm } );
```
