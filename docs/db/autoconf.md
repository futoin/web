---
path: /docs/db/autoconf/
---

# Database Auto-configuration

For historical reasons, web applications often use environment variables
to setup database and listening interface. That abstracts provisioning systems
from getting into details of each application configuration.

So called "dotenv" - `.env` files in root of deployment have been used to
store such environment variables.

Therefore, FutoIn database concept provides a handy `AutoConfig` utility.
It is possible to supply supported database type as "type" option of
preconfigured connection. Example:

```javascript
const DBAutoConfig = require('futoin-database/AutoConfig');
DBAutoConfig(as, ccm, {
    // DB_MAIN_TYPE must be either of these
    main : { type: ['mysql', 'postgresql'] },
    // DB_DWH_TYPE must be exactly this
    dwh : { type: 'postgresql' },
});
as.add( (as) => {
    // Use connection called "main"
    ccm.db('main').query(as, '...');
    // the same
    ccm.iface('#db.main').query(as, '...');
    // use another connection
    ccm.db('dwh').query(as, '...');
});
```

For each named database, a dedicated interface is registered on CCM with
special `#db.${name}` alias.

## Environment variable pattern

*Note: `{NAME}` is connection name in uppercase*

* `DB_{NAME}_TYPE` - type of database engine.
* `DB_{NAME}_HOST` - target host.
* `DB_{NAME}_PORT` - target TCP, UDP or UNIX port.
* `DB_{NAME}_USER` - user name.
* `DB_{NAME}_PASS` - user password.
* `DB_{NAME}_DB` - database name.
* `DB_{NAME}_MAXCONN` - maximum concurrent connections allowed.

`DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_DB` and `DB_MAXCONN` environment
variables are used to autoconfigure "default" connection.

`DB_{NAME}_TYPE`, `DB_{NAME}_HOST`, `DB_{NAME}_PORT` and other variable names are
used to configure any arbitrary "`{name}`" connection. The list of expected
connection names must be supplied to `AutoConfig()` function.

## CCM extension

`AutoConfig` adds a handy `ccm.db(name)` API extension to particular CCM instance.
This is shortcut for calling `ccm.iface('#db.${name}')`.
