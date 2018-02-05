---
path: /docs/miscjs/hkdf/
---

# JS: futoin-hkdf

Node.js implementation of [RFC5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)](https://tools.ietf.org/html/rfc5869).

* [GitHub](https://github.com/futoin/util-js-hkdf)
* [npmjs](https://www.npmjs.com/package/futoin-hkdf)

The implementation is fully compliant with test vectors provided in the RFC.

There are alternative modules, but they are:
* much less performing and/or
* have quite poor code quality at the moment and/or
* are not compliant with RFC (e.g. work only with string parameters) and/or
* not working with current Node.js versions and/or
* do not support arbitrary hash functions and/or
* not reliable dependency for FutoIn Security concept in general.

Standalone HKDF `extract()` and `expand()` actions are also available for advanced usage.

## Performance comparison

The figures in "derived keys per second".

* **futoin-hkdf** - **74 642**
    - fully compliant
* `node-hdkf`/`hdkf` modules - *57 707* (~22% slower)
    - seems to be broken by design
    - **produces wrong results with RFC test vectors**
* `ctrlpanel-hdkf` - *52 181* (~30% slower)
    - seems to be compliant
* `@stablelib/hkdf` - *39 808* (~46% slower)
    - seems to be compliant

## Installation for Node.js

Command line:
```sh
$ npm install futoin-hkdf --save
```
or:

```sh
$ yarn add futoin-hkdf --save
```

## Examples

```javascript
const hkdf = require('futoin-hkdf');

// Parameter overview
//-------------------
// initial keying material
const ikm = 'string-or-buffer';
// required output length in bytes
const length = 16;
// can be empty string or false equivalent
const salt = 'strongly-encouraged';
// optional parameter
const info = 'optional-context';
// HMAC hashing algorithm to use
const hash = 'SHA-256';

// Generic derivation
//-------------------
hkdf(ikm, length, {salt, info, hash}); // Buffer(length) - derived key
hkdf(ikm, length, {salt, info, hash}).toString('hex'); // String(2*length)

// NOTE: all optional paramaters are passed in object

// With some parameters omitted
//-------------------
hkdf(ikm, length, {salt});
hkdf(ikm, length, {info});
hkdf(ikm, length, {hash});
hkdf(ikm, length);

// Advanced usage (only if you know what you are doing)
//-------------------
hkdf.hash_length(hash); // get hash_len
hkdf.extract(hash, hash_len, ikm, salt); // run only step #1
hkdf.expand(hash, hash_len. prk, length, info); // run only step #2
```
