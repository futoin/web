---
path: /docs/db/install/
---

# FutoIn Database installation

## JavaScript

CommonJS implementation is available as [futoin-database](https://www.npmjs.com/package/futoin-database) npm module.

```bash
npm install futoin-database
# or
yarn add futoin-database
```

### Usage

For Node.js v6+:

```javascript
const DBAutoConfig = require('futoin-database/AutoConfig');
DBAutoConfig(as, ccm, {
    // DB_MAIN_TYPE must be either of these
    main : { type: ['mysql', 'postgresql'] },
    // DB_DWH_TYPE must be exactly this
    dwh : { type: 'postgresql' },
});
ccm.db('main').query(as, 'SELECT 1');
```

For older versions, transpiled sources are available under `es5/` folder.
