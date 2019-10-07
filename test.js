const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const studentData = {
  id: 1,
  propertyName: 1
}

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})
tape('put', async function (t) {
  const url = `${endpoint}/${studentData.id}/${studentData.propertyName}`
    , opts = {
  }
    , data = {
  }
    , fn   = function (err, body) {
    if (err) t.error(err)
    t.ok(body.success, 'Property successfully saved')
    t.end()
  }

  jsonist.put(url, data, opts, fn)
})

tape('get', async function (t) {
  const url = `${endpoint}/${studentData.id}/${studentData.propertyName}`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'Result successfully received')
    t.end()
  })
})

tape('delete', async function (t) {
  const url = `${endpoint}/${studentData.id}/${studentData.propertyName}`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'Property successfully deleted')
    t.end()
  })
})



tape('cleanup', function (t) {
  server.close()
  t.end()
})
