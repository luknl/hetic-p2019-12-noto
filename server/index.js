const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let allMessages = {
  mainRoom: [],
  room1: [],
}

app.get('/notoboard', function(req, res){
  res.sendFile(__dirname + '/notoboard.html')
})
io.on('connection', function(socket){
  io.emit('previous messages', allMessages.mainRoom)
  socket.on('chat message', function(msg){
    // Send message to clients
    io.emit('chat message', msg)
    // Save the message
    allMessages.mainRoom.push(msg)
  })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})

app.get('/send/:idSender', function(req, res){
  res.sendFile(__dirname + '/send.html')
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
