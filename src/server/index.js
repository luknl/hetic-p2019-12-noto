/* @flow */

import express from 'express'
import cors from 'cors'
import httpServer from 'http'
import compression from 'compression'
import * as actions from './../shared/modules/notoSpace/actions'
import { dispatch, watch } from './../shared/helpers/socket'

// Initialyze express server
const app = express()
const http = httpServer.Server(app)
const port = process.env.PORT || 8080
app.use(cors())
app.use(compression()) // Enable GZIP
app.use(
  express.static(
    __dirname + '/../../dist',
    { maxAge: 10 }, // Cache content one day
  ),
)
http.listen(port, () => console.log('listening on ' + port + ' 😎 💪'))

// Initialyze sockets
const io = require('socket.io')(http)

// Get actions and actionTypes
const {
  getAllMessages, sendMessage,
  getUser, addUser,
  createRoom, joinRoom, getAllRooms, stopTyping, startTyping,
  ...actionTypes,
} = actions

// Initialyze rooms, messages and users
const rooms = [{ id: 0, name: 'Main' }]
const messages = { [0]: [{
  value: 'صباح الخير',
  roomId: 0,
  createAt: new Date(),
  country: 'ar', // arabic
}, {
  value: 'שלום',
  roomId: 0,
  createAt: new Date(),
  country: 'hb', // hebrew
}, {
  value: 'bonjour',
  roomId: 0,
  createAt: new Date(),
  country: 'fr', // france
}, {
  value: 'hello',
  roomId: 0,
  createAt: new Date(),
  country: 'en', // english
}, {
  value: 'привет',
  roomId: 0,
  createAt: new Date(),
  country: 'ru', // russian
}, {
  value: 'χαίρω',
  roomId: 0,
  createAt: new Date(),
  country: 'cy', // cypriot
}, {
  value: 'もしもし',
  roomId: 0,
  createAt: new Date(),
  country: 'ja', // japanese
}] }
const users = []

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
  )(socket, { to: defaultRoomId })


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
        // Get language
        const { language } = payload
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
          mobileSocketId: null,
          isConnected: false,
          language,
        }
        users.push(user)
        socket.join(defaultRoomId)
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
        )(io, { to: message.roomId })
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
          users[currentUserId] = {
            ...currentUser,
            isConnected: true,
            mobileSocketId: socket.id,
          }
        }
        // Send response to client
        const to = (!currentUser || !currentUser.roomId)
          ? defaultRoomId
          : currentUser.roomId
        dispatch(getUser(currentUser))(socket, { to })
      }
      break


      /**
       * Create room
       */
      case actionTypes.INITIALIZE_ROOM: {
        // Build room and save it
        const { roomName } = payload
        const roomId = rooms.length
        const room = {
          id: roomId,
          name: roomName,
        }
        rooms.push(room)
        messages[roomId] = []
        // Join to it (mobile)
        const userId = users.findIndex(({ mobileSocketId }) => {
          return mobileSocketId === socket.id
        })
        if (userId === -1) return
        users[userId].previousRoomId = users[userId].roomId
        users[userId].roomId = roomId
        const user = users[userId]
        socket.leave(user.roomId)
        socket.join(roomId)
        // Call clients
        dispatch(
          createRoom(room, user),
          joinRoom(room, user),
        )(io)
        break
      }


      /**
       * Join a room
       */
      case actionTypes.JOIN_ROOM: {
        const { user, room } = payload
        const userId = users.findIndex(({ id }) => id === user.id)
        // From mobile
        if (!users[userId]) return
        if (users[userId].mobileSocketId === socket.id) {
          users[userId].previousRoomId = users[userId].roomId
          users[userId].roomId = room.id
          dispatch(joinRoom(room, users[userId]))(io)
        }
        // From desktop
        else {
          socket.leave(users[userId].previousRoomId)
          socket.join(user.roomId)
          dispatch(getAllMessages(messages[user.roomId]))(socket)
        }
        break
      }


      /**
       * Send to desktop user who's writing
       */
       case actionTypes.START_TYPING: {
         const { user } = payload
         dispatch(startTyping(user))(io, { to: user.roomId })
         break
       }

      /**
       * Send to desktop user who stopped writing
       */
       case actionTypes.STOP_TYPING: {
         const { user } = payload
         dispatch(stopTyping(user))(io, { to: user.roomId })
         break
       }

    }

  })(socket)

})
