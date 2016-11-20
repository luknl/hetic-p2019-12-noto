/* @flow */

import express from 'express'
import cors from 'cors'
import httpServer from 'http'
import geoip from 'geoip-lite'
import * as actions from './../shared/modules/notoSpace/actions'
import { dispatch, watch } from './../shared/helpers/socket'

// Initialyze express server
const app = express()
const http = httpServer.Server(app)
const port = process.env.PORT || 8080
app.use(cors())
app.use(express.static(__dirname + '/../__build__'))
http.listen(port, () => console.log('listening on ' + port + ' 😎 💪'))

// Initialyze sockets
const io = require('socket.io')(http)

// Get actions and actionTypes
const { getAllRooms, getAllMessages, getUser, addUser, sendMessage, ...actionTypes } = actions

// Initialyze rooms
const rooms = [{ id: 0, name: 'main' }, { id: 1, name: 'room 1' }]

const messages = {
  [0]: [],
  [1]: [
    {
      message: 'First message, hard written',
      date: '2016-11-17T15:21:18.087Z',
    }
  ],
}

const users = []


/**
 * IO connect =)
 */
io.on('connection', (socket) => {


  /**
   * Add user to first room and send to him
   * all mesages and rooms
   */
  const defaultRoomId = rooms[0].id
  socket.join(defaultRoomId)
  dispatch(
    getAllMessages(messages[defaultRoomId]),
    getAllRooms(rooms),
  )(io, { to: defaultRoomId })


  /**
   * Watch io events
   */
  watch(({ type, payload }) => {
    console.log({ type, payload })
    switch (type) {

      /**
       * Generate a new user
       */
      case actionTypes.GENERATE_USER: {
        // Generate unsed ID
        let userId = Math.floor(Math.random() * 1000)
        while (users.find(({ id }) => id === userId)) {
          userId = Math.floor(Math.random() * 1000)
        }
        // Build user
        const user = {
          id: userId,
          roomId: defaultRoomId,
          desktopSocketId: socket.id,
          isConnected: false,
        }
        users.push(user)
        // Send new user to connect
        dispatch(
          addUser(user),
        )(io, { to: defaultRoomId })
        break
      }


      /**
       * Send a message
       */
      case actionTypes.SEND_MESSAGE: {
        const { message  } = payload
        // Broadcast message to all users of the room
        dispatch(
          sendMessage(message),
        )(socket, { to: message.roomId })
        // Save new message
        messages[message.roomId].push(message)
        break
      }


      /**
       * Connect two clients
       */
      case actionTypes.CONNECT_USER: {
        const { userId } = payload
        // Check if id exists and user hasn't been
        // connected before
        const currentUserId = users.findIndex(({ id, isConnected }) => {
          return id === userId && !isConnected
        })
        const currentUser = users[currentUserId]
        // Update isConnected value
        if (currentUser) {
          users[currentUserId] = { ...currentUser, isConnected: true }
        }
        // Send response to client
        const to = (!currentUser || !currentUser.roomId)
          ? defaultRoomId
          : currentUser.roomId
        dispatch(getUser(currentUser))(io, { to })
      }
    }

  })(socket)

})





//   // Leave
//   socket.on('LEAVE_ROOM', (roomId) => {
//     socket.leave(roomId)
//   })
//
//   socket.on('JOIN_ROOM', (data) => {
//     // Create room if it doesn't exist
//     if (!messages[data.roomId]) {
//       messages[data.roomId] = []
//     }
//     socket.join(data.roomId)
//     io.to(data.desktopSocketId).emit('CHANGE_ROOM', {roomId: data.roomId})
//     // Send all previous messages
//     messages[data.roomId].map((roomMessages) => {
//       io.to(data.roomId).emit('chat message', {
//         message:     roomMessages.message,
//         roomId:  data.roomId,
//         date:    data.date,
//       })
//     })
//   })
//
//
//   // Create new room from "send" client
//   socket.on('create room', (data) => {
//     // Create memory location where messages will be saved
//     if (!messages[data.roomId]) {
//       messages[data.roomId] = []
//     }
//     socket.join(data.roomId)
//     io.to(data.roomId).emit('chat message', {
//       roomId: data.roomId,
//       roomName: data.roomName,
//       message: 'This is a message to ' + data.roomId,
//     })
//
//     // Give notoboard the infos to create a room for other to join
//     io.emit('add room', {
//       roomId: data.roomId,
//       roomName: data.roomName,
//     })
//   })
// })
