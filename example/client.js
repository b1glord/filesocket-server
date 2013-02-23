var FileSocketClient = require('filesocket-client')

var client = new FileSocketClient()

client.on('connect', function(){
  client.requestDirectory('/')
})

client.on('dir', function(dirname, stats){
  for(var file in stats){
    client.requestFile(dirname + file)
  }
})

client.on('file', function(filename, stat, stream){
  stream.on('data', function(data){
    var str = String.fromCharCode.apply(null, new Uint8Array(data));
    console.log(filename, str)
  })
  stream.on('end', function(){console.log('EOF')})
})

window.client = client
