const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let allMessages = {
  mainRoom: [],
  room1: [],
}
let clients = []

app.get('/notoboard', function(req, res){
  res.sendFile(__dirname + '/notoboard.html')
})

app.get('/send/:idSender', function(req, res){
  res.sendFile(__dirname + '/send.html')
})

io.on('connection', function(socket){
  io.emit('previous messages', allMessages.mainRoom)
  socket.on('chat message', function(msg){
    // Send message to clients
    io.emit('chat message', msg)
    allMessages.mainRoom.push(msg)
  })
  socket.on('new user', function(userId){
    // Save the message
    clients.push({
      socketId: socket.id,
      id: userId,
      time: Date.now(),
    })
  })

  socket.on('join room', function(roomName){
    socket.join(roomName)
    io.sockets.in(roomName).emit('chat message', 'what\'s up bitches? ' + roomName)
  })
  // socket.on('leave room', function(roomName){
  //   socket.leave(roomName)
  // })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })

  socket.on('get user', function(userId){
    const infos = clients.filter(function(el) {
      return el.id == userId
    })
    io.emit('user infos', infos)
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000')
})
