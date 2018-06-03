---
path: /docs/eventstream/archiver/
---

# Event Archiver

Sometimes, it's required to keep full history of events. However, it's inefficient
to have a very large database for realtime operations. Therefore, a special
`DBEventArchiver` tool is provided to reliably transfer events into data warehouse.

The interface is the same as for [`ReliableEventReceiver`](/docs/eventstream/receiver/), except
addition configuration option: `history_table`.

`DBEventArchiver` expects CCM to have Database connection named `evtdhw` to be configured.

## Usage

```javascript
const DBEventArchiver = require( 'futoin-eventstream/DBEventArchiver' );

// Initialize CCM & DWH connection
const ccm = new AdvancedCCM();
DBAutoConfig( as, ccm, { evtdwh: {} } );

// Initialize and start DB Event Archiver
const archiver = new DBEventArchiver(ccm);
archiver.start( endpoint, credentials );
```

