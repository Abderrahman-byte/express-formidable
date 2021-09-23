'use strict'

const formidable = require('formidable')

const parse = (options = {}, events = []) => {
    if (!(options instanceof Object)) {
        throw new TypeError('Options argument must be an object')
    }

    if (!(events instanceof Array)) {
        throw new TypeError('Events argument must be an array')
    }

    return (request, response, next) => {
        if (request.readableEnded) return next()

        const errorHandled = events instanceof Array && events.length > 0 && events.some(e => e.event === 'error')
        const form = new formidable.IncomingForm(options)

        if (events instanceof Array) {
            events.forEach((e) => {
                form.on(e.event, (...args) => e.action(request, response, next, ...args))
            })
        }

        if (!errorHandled) {
            form.on('error', err => next(err))
        }

        form.parse(request, (err, fields, files) => {
            if (err) return next(err)

            Object.assign(request, { fields, files, _body: true })
            return next()
        })
    }
}

module.exports = parse
exports.parse = parse
