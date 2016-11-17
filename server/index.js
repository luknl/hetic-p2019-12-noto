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

// Desktop route
app.get('/notoboard', function(req, res){
  res.sendFile(__dirname + '/notoboard.html')
})

// Mobile route
app.get('/send/', function(req, res){
  res.sendFile(__dirname + '/send.html')
})

io.on('connection', function(socket){
  io.emit('previous messages', allMessages.mainRoom)
  io.emit('previous rooms', { roomIds: Object.keys(allMessages)})

  socket.on('chat message', function(data){
    // Check if the message is for the mainRoom
    if (data.roomId == '') {
      // Send message to clients
      io.emit('chat message', {
        msg: data.msg,
        roomId: data.roomId,
        roomName: data.roomName,
      })
      allMessages.mainRoom.push({msg: data.msg})
    } else {
      // Send message to clients
      io.to(data.roomId).emit('chat message', {
        msg: data.msg,
        roomId: data.roomId,
        roomName: data.roomName,
      })
      // Save the message to the good room
      allMessages[data.roomId].push({msg: data.msg})
    }
    console.log(allMessages[data.roomId])
  })

  socket.on('new user', function(data){
    // Save the message
    clients.push({
      desktopSocketId: socket.id,
      urlId: data.urlId,
      currentRoom: data.currentRoom,
      time: Date.now(),
    })
    console.log('New user desktop user', data.urlId, 'in', data.currentRoom)
  })

  socket.on('join room', function(data){
    // Create room if it doesn't exist
    if (!allMessages[data.roomId]) {
      allMessages[data.roomId] = []
    }
    socket.join(data.roomId)
    // Send all previous messages
    allMessages[data.roomId].map((roomMessages) => {
      io.to(data.desktopSocketId).emit('change room', {roomId: data.roomId})
      io.to(data.roomId).emit('chat message', {
        msg: roomMessages.msg,
        roomId: data.roomId,
      })
    })
    console.log(allMessages)
  })

  // Leave
  socket.on('leave room', function(roomId){
    socket.leave(roomId)
  })

  // Get user infos to the send page
  socket.on('get user', function(data){
    // Get client infos thanks to urlId
    const infos = clients.filter(function(el) {
      return el.urlId == data.urlId
    })
    if (infos.length == 0) {
      io.emit('user infos', 'Not a valid link')
    } else {
      io.emit('user infos', infos)
      console.log('Mobile user linked to id', data.urlId )
    }
  })

  // Create new room from "send" client
  socket.on('create room', function(data){
    // Create memory location where messages will be saved
    if (!allMessages[data.roomId]) {
      allMessages[data.roomId] = []
    }
    socket.join(data.roomId)
    io.to(data.roomId).emit('chat message', {
      roomId: data.roomId,
      roomName: data.roomName,
      msg: 'This is a message to ' + data.roomId,
    })

    // Give notoboard the infos to create a room for other to join
    io.emit('add room', {
      roomId: data.roomId,
      roomName: data.roomName,
    })
    console.log(allMessages)
  })
})


http.listen(3000, function(){
  console.log('listening on *:3000')
})
