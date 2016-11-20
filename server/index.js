import express from 'express'
// import geoip from 'geoip-lite'
import cors from 'cors'

const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.static(__dirname + '/../__build__'))

let messages = {
  mainRoom: [],
  room1: [
    {
      message: 'First message, hard written',
      date: '2016-11-17T15:21:18.087Z',
    }
  ],
}
let clients = []

const io = require('socket.io')(http)

const GET_ALL_MESSAGES = 'GET_ALL_MESSAGES'

io.on('connection', (socket) => {

  io.emit('dispatch', {
    type: GET_ALL_MESSAGES,
    payload: {
      messages: messages.mainRoom,
    },
  })

  io.emit('previous rooms', { roomIds: Object.keys(messages)})


  const SEND_MESSAGE = 'SEND_MESSAGE'




  // @TODO use watch helper
  socket.on('dispatch', ({ type, payload }) => {
    switch (type) {

      // @TODO user dispath helper with actionCreators
      case SEND_MESSAGE: {
        const { message  } = payload
        const { roomId } =  message
        if (roomId === -1) {
          io.emit('dispatch', {
            type: SEND_MESSAGE,
            payload,
          })
          messages.mainRoom.push(message)
        } else {
          io.to(roomId).emit('dispatch', {
            type: SEND_MESSAGE,
            payload,
          })
          messages[roomId].push(message)
        }
        break
      }

    }
  })






  socket.on('new user', (data) => {
    console.log(socket.request.connection.remoteAddress)
    // let geo = geoip.lookup(ip)
    // console.log(geo.country)
    // Save the message
    clients.push({
      desktopSocketId: socket.id,
      urlId: data.urlId,
      currentRoom: data.currentRoom,
    })
    console.log('New user desktop user', data.urlId, 'in', data.currentRoom)
  })

  // Leave
  socket.on('LEAVE_ROOM', (roomId) => {
    socket.leave(roomId)
  })

  socket.on('JOIN_ROOM', (data) => {
    // Create room if it doesn't exist
    if (!messages[data.roomId]) {
      messages[data.roomId] = []
    }
    socket.join(data.roomId)
    io.to(data.desktopSocketId).emit('CHANGE_ROOM', {roomId: data.roomId})
    // Send all previous messages
    messages[data.roomId].map((roomMessages) => {
      io.to(data.roomId).emit('chat message', {
        message:     roomMessages.message,
        roomId:  data.roomId,
        date:    data.date,
      })
    })
    console.log('messages', messages)
  })


  // Get user infos to the send page
  socket.on('get user', (data) => {
    // Get client infos thanks to urlId
    const infos = clients.filter((el) => {
      return el.urlId == data.urlId
    })
    if (infos.length == 0) {
      io.to(socket.id).emit('user infos', 'Not a valid link')
    } else {
      io.to(socket.id).emit('user infos', infos)
      console.log('Mobile user linked to id', data.urlId )
    }
  })

  // Create new room from "send" client
  socket.on('create room', (data) => {
    // Create memory location where messages will be saved
    if (!messages[data.roomId]) {
      messages[data.roomId] = []
    }
    socket.join(data.roomId)
    io.to(data.roomId).emit('chat message', {
      roomId: data.roomId,
      roomName: data.roomName,
      message: 'This is a message to ' + data.roomId,
    })

    // Give notoboard the infos to create a room for other to join
    io.emit('add room', {
      roomId: data.roomId,
      roomName: data.roomName,
    })
  })
})


http.listen(port, () => {
  console.log('listening on ' + port)
})
