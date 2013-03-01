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
    console.log(filename, ab2str(data))
  })
  stream.on('end', function(){console.log('EOF')})
})

window.client = client

//http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
