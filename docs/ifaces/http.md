---
path: /docs/ifaces/http/
---

# HTTP integration

FutoIn is agnostic to communication channel. However, HTTP does
provide some benefits and is more human friendly in some aspects.

Below are some highlights from  [FTN5 HTTP integration](https://specs.futoin.org/final/preview/ftn5_iface_http_integration.html) spec.

## HTTP status code

**IMPORTANT:** even for errors, HTTP status code is 200!

That's done by intention as HTTP is only a transport communication channel.

## HTTP Basic Authorization

Plain login & password is extracted from `Authorization: Basic {base64}` HTTP header, if present.

## Human-friendly GET

The following URL coding is supported: `{ENDPOINT}/{iface}/{version}/{function}[/sec-field][?query_params]`

Example: `https://example.com/api/futoin.anonping/1.0/ping?echo=1234`

## Interoperation with POST form data

URL format: `{ENDPOINT}/{iface}/{version}/{function}[/sec-field]`

Parameters must be sent in POST

## Raw data upload

Use the GET URL above, but with POST raw data.

## MIME-types for Content-Type header

* `application/futoin+json` for JSON coding
* `application/futoin+cbor` for CBOR coding
* `application/futoin+msgpack` for MessagePack coding
* `application/futoin+` as prefix for other formats not defined here
