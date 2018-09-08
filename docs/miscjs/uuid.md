---
path: /docs/miscjs/uuid/
---

# JS: futoin-uuid

A primitive wrapper of [uuid](https://www.npmjs.com/package/uuid) package for
UUID v4 generation with Base64 encoding.

The reason is to get a universal and short UUID representation in printable characters
which can be efficiently used in JSON and databases without special UUID type.

It produces only 22 characters instead of canonical 36 hexdecimal chars with separators.

* [GitHub](https://github.com/futoin/util-js-uuid)
* [GitLab](https://gitlab.com/futoin/util/js/uuid)
* [npmjs](https://www.npmjs.com/package/futoin-uuid)

## Usage

```javascript
const UUIDTool = require('futoin-uuid');

UUIDTool.genBin(); // -> Buffer(16)
UUIDTool.genB64(); // -> String(22)
