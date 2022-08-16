#!/bin/sh
':' //# https://medium.com/@patrickleet ; exec /usr/bin/env node --experimental-modules "$0" "$@"

const res = await fetch('http://localhost:3000/ping')
if (res.ok) {
    process.exit(0)
}
process.exit(1)
