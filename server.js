const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())

app.get('/health', api.getHealth)

/**
 * @api {put} /:studentId/:propertyName Request student information
 * @apiGroup student
 *
 * @apiParam {Number} studentId unique student ID .
 * @apiParam {Number} propertyName unique property name .
 *
 * @apiSuccess {success: true} .
 */

app.put('/:studentId/*', api.putStudent)

/**
 * @api {get} /:studentId/:propertyName Request student information
 * @apiGroup student
 *
 * @apiParam {Number} studentId unique student ID .
 * @apiParam {Number} propertyName unique property name .
 *
 * @apiSuccess {obj} .
 */

app.get('/:studentId*', api.getStudent)

/**
 * @api {delete} /:studentId/:propertyName Request student information
 * @apiGroup student
 *
 * @apiParam {Number} studentId unique student ID .
 * @apiParam {Number} propertyName unique property name .
 *
 * @apiSuccess {success: true} .
 */

app.delete('/:studentId/*', api.deleteStudent)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
