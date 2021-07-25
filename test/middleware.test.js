'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const app = require('./helpers/server')
const send = require('./helpers/send')

const checkTwoFiles = (path1, path2) => {
    assert(fs.readFileSync(path1).toString(), fs.readFileSync(path2).toString())
}

beforeAll((done) => { app.start(done) })

test('parses application/x-www-form-urlencoded', (done) => {
    const data = { author: 'Abderrahmane' }
    const expectedData = { body: {}, fields: data, files: {} }

    send('application/x-www-form-urlencoded', data, '/echo', (error, response, body) => {
        assert(error === null, error)
        const received = JSON.parse(body)

        assert.deepStrictEqual(received, expectedData)
        done()
    })
}, 1000)

test('parses application/json', (done) => {
    const data = { author: 'Abderrahmane' }
    const expectedData = { body: data }

    send('application/json', data, '/echo', (error, response, body) => {
        assert(error === null, error)
        assert.deepStrictEqual(body, expectedData)
        done()
    })
}, 1000)

test('parses multipart/form-data without a file', (done) => {
    const data = { author: 'Abderrahmane' }
    const expectedData = { body: {}, fields: data, files: {} }

    send('multipart/form-data', data, '/echo', (error, response, body) => {
        assert(error === null, error)
        const received = JSON.parse(body)

        assert.deepStrictEqual(received, expectedData)
        done()
    })
}, 1000)

test('parses multipart/form-data with file', (done) => {
    const pathToFile1 = path.join(__dirname, '/fixtures/file1.txt')
    const pathToFile2 = path.join(__dirname, '/fixtures/file2.txt')

    const data = {
        author: 'Abderrahmane',
        number: Math.floor(Math.random() * 1000),
        file1: fs.createReadStream(pathToFile1),
        file2: fs.createReadStream(pathToFile2),
    }

    send('multipart/form-data', data, '/echo', (err, response, body) => {
        const received = JSON.parse(body)
        assert.strictEqual(received.fields.author, data.author)
        assert.strictEqual(Number(received.fields.number), data.number)
        checkTwoFiles(received.files.file1.path, pathToFile1)
        checkTwoFiles(received.files.file2.path, pathToFile2)
        done()
    })
}, 1000)
