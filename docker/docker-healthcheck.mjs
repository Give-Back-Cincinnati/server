#!/bin/sh
':' //# https://medium.com/@patrickleet ; exec /usr/bin/env yarn node --experimental-modules "$0" "$@"

// we can add other thing to the healthcheck if we need to in this document

import axios from 'axios'

axios.get('http://localhost:300a/ping')
    .then(({ status }) => {
        process.exit(status === 200 ? 0 : 1)
    })
    .catch(e => {
        process.exit(1)
    })
