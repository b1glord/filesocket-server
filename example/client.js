var FileSocketClient = require('filesocket-client')

var client = new FileSocketClient()

client.on('connect', function(){
  client.requestDirectory('/')
})

client.on('dir', function(dirname, stats){
  console.log(arguments)
})

client.on('file', function(filename, stat, stream){
  console.log(arguments)
  stream.on('data', function(data){console.log(new DataView(data))})
  stream.on('end', function(){console.log('EOF')})
})

window.client = client
