var FileSocketServer = require('../')
var http = require('http')
var fs = require('fs')
var send = require('send')

var fss = new FileSocketServer({root: __dirname + '/files'})

var server = http.createServer(function(req, res){
  send(req, req.url)
    .root(__dirname + '/public')
    .pipe(res)
})

fss.bind(server)

server.listen(8000)
