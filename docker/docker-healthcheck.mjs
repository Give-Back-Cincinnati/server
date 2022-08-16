#!/bin/sh
':' //# https://medium.com/@patrickleet ; exec yarn healthcheck

// we can add other thing to the healthcheck if we need to in this document

import axios from 'axios'

axios.get('http://localhost:3000/ping')
    .then(({ status }) => {
        process.exit(status === 200 ? 0 : 1)
    })
