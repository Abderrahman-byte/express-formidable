'use strict'

const express = require('express')
const expressFormidable = require('../../lib/middleware')

const app = express()

app.use(express.json())
app.use(expressFormidable({ multiples: true }))

app.post('/echo', (request, response) => {
    const { fields, files, body } = request
    response.json({ fields, files, body })
})

app.start = cb => app.listen(1234, () => {
    console.log('listening on port 1234')
    cb()
})

module.exports = app
