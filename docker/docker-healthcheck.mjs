#!/bin/sh
// ':' //# https://medium.com/@patrickleet ; echo hello; exec /usr/bin/env yarn node --experimental-modules "$0" "$@"
import axios from 'axios'

axios.get('http://localhost:3000/ping')
    .then(({ status }) => {
        process.exit(status === 200 ? 0 : 1)
    })
    .catch(e => {
        process.exit(1)
    })
