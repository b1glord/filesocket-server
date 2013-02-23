'use strict'

var WebSocketServer = require('ws').Server
var statDir = require('stat-all-the-things')
var fs = require('fs')
var msgpack = require('msgpack-js')
var path = require('path')

module.exports = FileSocketServer

var S   = 1
, DIR   = S++
, FILE  = S++

function FileSocketServer(options){
  var wss, handler
  if(!options.root) throw new Error("Must specify a root directory")
  return {bind: bind}

  function bind(connection){
    wss = new WebSocketServer(connection)
    wss.on('connection', function(sock){
      handler = dataHandler(options, sock)
      sock.on('message', function(msg){
        handler(msgpack.decode(msg))
      })
    })
  }
}

function dataHandler(options, sock){
  var check = options.hook || function(msg, cb){cb()}
  var root = path.resolve(options.root)

  return function(msg){
    check(msg, function(){
      var type = msg.type
      var id = msg.id
      if(type == DIR){
        var pathname = path.normalize('/' + msg.path)
        statDir(path.join(root, pathname), function(err, stat){
          if(err) return send({id:id, error:err.message})
          send({id:id, stat:stat})
        })
      } else if(type == FILE){
        var pathname = path.normalize('/' + msg.path)
        var filepath = path.join(root, pathname)
        fs.stat(filepath, function(err, stat){
          if(err) return send({id:id, error:err.message})
          send({id:id, stat:stat})
          var stream = fs.createReadStream(filepath)
          stream.on('data', function(data){
            send({id:id, data:data})
          })
          stream.on('error', function(err){
            send({id:id, error:err})
          })
          stream.on('end', function(data){
            send({id:id, data:data, eof:true})
          })
        })
      }
    })
  }


  function send(obj){
    sock.send(msgpack.encode(obj), {binary: true})
  }
}
