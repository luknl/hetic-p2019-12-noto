const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var messages = []

app.get('/notoboard', function(req, res){
  res.sendFile(__dirname + '/notoboard.html')
})

io.on('connection', function(socket){
  console.log('a user connected')
  socket.on('chat message', function(msg){
    // Send message to clients
    io.emit('chat message', msg)
    messages.push(msg)
    console.log(messages)
  })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
