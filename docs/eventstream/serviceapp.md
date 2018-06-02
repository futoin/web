---
path: /docs/eventstream/serviceapp/
---

# Event Service App

FutoIn EventStream provides [ServiceApp](/doc/microservices/serviceapp/).

## Database-specific

Database EventStream have special implementation and special `DBServiceApp` therefore.

### Basic usage:

```javascript
const DBEventStreamApp = require( 'futoin-eventstream/DBServiceApp' );

const esapp = new DBServiceApp( as );

// Access executor to attach receiver
const executor = esapp.executor();

// Access automatically initialized CCM
const ccm = esapp.ccm();

// Generation inerface
ccm.iface('#evtgen');

// Polling interface
ccm.iface('#evtpoll');

// Pushing interface
ccm.iface('#evtpush');
```

### With tunable options:

```javascript
const DBEventStreamApp = require( 'futoin-eventstream/DBServiceApp' );

const ccm = new AdvancedCCM();
const executor = new Executor();
const esapp = new DBServiceApp( as, {
    // Tune CCM
    ccmOptions: {},
    // Tune private Executor
    executorOptions: {},
    // Tune EventStream options
    evtOptions: {},
    
    // Enable DBDiscarder and tune options
    enableDiscarder: true,
    discarderOptions: {},
    
    // Enable DBArchiver and tune options
    enableArchiver: true,
    archiverOptions: {},
} );
```

### Advanced usage:

```javascript
const DBEventStreamApp = require( 'futoin-eventstream/DBServiceApp' );

const ccm = new AdvancedCCM();
const executor = new Executor();
const esapp = new DBServiceApp( as, {
    // external CCM instance
    ccm,
    // external private executor instance
    executor,
    // 'notExpected' error handler
    notExpectedHandler: function() {
        console.log(arguments);
    },
} );
```


