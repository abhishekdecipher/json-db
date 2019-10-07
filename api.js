const fs = require('fs')
const middleware = require('./middleware')
module.exports = {
  getHealth,
  putStudent,
  getStudent,
  deleteStudent
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function putStudent (req, res, next) {
  let body = '';

  req.on('data', (x) => {
    body += x.toString();
  });

  req.on('end', (x) => {
    if (req.params.studentId) {
      const filename = 'data/' + req.params.studentId + '.json'
      const rowData = fs.existsSync(filename) ? fs.readFileSync(filename) : '{}'
      const studentData = JSON.parse(rowData)

      fs.writeFile(filename, JSON.stringify(updateObj(studentData, req.params['0'].split('/'), JSON.parse(body))), function (err) {
        if (err) throw err
        res.json({ success: true })
      })
    } else {
      middleware.notFound(req, res)
    }
  });

}

async function getStudent (req, res, next) {
  const filename = 'data/' + req.params.studentId + '.json'
  if (fs.existsSync(filename)) {
    const rowData = fs.readFileSync(filename)
    const studentData = JSON.parse(rowData)

    var searchData = req.params['0'] ? req.params['0'].substr(1).split('/').reduce(function (o, k) {
      return o && o[k]
    }, studentData) : studentData
    if (searchData) {
      res.json({ success: true, data: searchData })
    } else {
      middleware.notFound(req, res)
    }
  } else {
    middleware.notFound(req, res)
  }
}

async function deleteStudent (req, res, next) {
  const filename = 'data/' + req.params.studentId + '.json'
  if (fs.existsSync(filename)) {
    const rowData = fs.readFileSync(filename)
    const studentData = JSON.parse(rowData)
    var searchData = req.params['0'].split('/').reduce(function (o, k) {
      return o && o[k]
    }, studentData)
    if (searchData) {
      fs.writeFile(filename, JSON.stringify( deletePropertyPath(studentData, req.params['0'].split('/'))), function (err) {
        if (err) throw err
        res.json({ success: true })
      })
    } else {
      middleware.notFound(req, res)
    }
  } else {
    middleware.notFound(req, res)
  }
}

function updateObj (obj = {}, path, value) {
  var schema = obj
  var len = path.length
  for (var i = 0; i < len; i++) {
    if (!schema[path[i]]) {
      schema[path[i]] = {}
    }
    if (i === len - 1) {
      schema[path[i]] = { ...schema[path[i]], ...value }
    }
    schema = schema[path[i]]
  }
  return obj
}
function deletePropertyPath (_obj, path) {
  path.reduce((acc, key, index) => {
    if (index === path.length - 1) {
      delete acc[key];
      return true;
    }
    return acc[key];
  }, _obj);
  return _obj;
}