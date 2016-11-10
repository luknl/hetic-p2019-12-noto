const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let allMessages = {
  mainRoom: [],
  room1: [
    {
      msg: 'First message, hard written'
    }
  ],
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
  io.emit('previous rooms', Object.keys(allMessages))

  socket.on('chat message', function(data){
    if (data.roomId == '') {
      // Send message to clients
      io.emit('chat message', {
        msg: data.msg,
        roomId: data.roomId,
        roomName: data.roomName,
      })
    } else {
      // Send message to clients
      io.sockets.in(data.roomId).emit('chat message', {
        msg: data.msg,
        roomId: data.roomId,
        roomName: data.roomName,
      })
    }
    // Check if the message is for the mainRoom
    if (data.roomId == '') {
      allMessages.mainRoom.push({msg: data.msg})
    } else {
      // Save the message to the good room
      allMessages[data.roomId].push({msg: data.msg})
    }
    console.log(allMessages)
  })

  socket.on('new user', function(urlId){
    // Save the message
    clients.push({
      socketId: socket.id,
      urlId: urlId,
      time: Date.now(),
    })
  })

  socket.on('join room', function(roomId){
    if (!allMessages[roomId]) {
      allMessages[roomId] = []
    }
    socket.join(roomId)
    io.sockets.in(roomId).emit('chat message', {
      msg: 'what\'s up bitches? ' + roomId,
      roomId,
    })
    // This will be deleted
    allMessages[roomId].push({msg: 'what\'s up bitches? ' + roomId})
    console.log(allMessages)
  })

  // Leave
  socket.on('leave room', function(roomId){
    socket.leave(roomId)
  })


  // Get user infos to the send page
  socket.on('get user', function(urlId){
    const infos = clients.filter(function(el) {
      return el.urlId == urlId
    })
    if (infos.length == 0) {
      io.emit('user infos', 'Not a valid link')
    } else {
      io.emit('user infos', infos)
    }
  })

  // Create new room from "send" client
  socket.on('create room', function(data){
    // Create memory location where messages will be saved
    if (!allMessages[data.roomId]) {
      allMessages[data.roomId] = []
    }
    socket.join(data.roomId)
    io.sockets.in(data.roomId).emit('chat message', {
      roomId: data.roomId,
      roomName: data.roomName,
      msg: 'This is a message to ' + data.roomId,
    })

    // Create the div for other to join
    io.emit('add room', {
      roomId: data.roomId,
      roomName: data.roomName,
    })
    console.log(allMessages)
  })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000')
})
