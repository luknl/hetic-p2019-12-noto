/* @flow */

import moment from 'moment'
import io from 'socket.io-client'
import { dispatch, watch } from '@helpers/socket'
import * as actions from './bundles/notoSpace/actions'

// Initialyze sockets
const socket = io('http://localhost:8080')

// Get actions and actionTypes
const { joinRoom, leaveRoom, ...actionTypes } = actions

// Select DOM elements
const $messages: HTMLElement = document.querySelector('.messages')
const $rooms: HTMLElement = document.querySelector('.rooms')












// Initialye messages
// const messages = new Map()

var rooms = []
const messagesColors = ['#457DF3', '#FC1B1F', '#1AB05A', '#FDBD2C']

// Generate ID
// @TODO: server must initialized an unsed ID
const urlId = Math.floor(Math.random()*1000)
document.querySelector('.url-connection').innerHTML = `<a href="http://localhost:3000/send/${urlId}" target="_blank" >http://localhost:3000/send/${urlId}</a>`
socket.emit('new user', {urlId, currentRoom: 'mainRoom'})








// Listen socket events
watch(({ type, payload }) => {
  console.log(type, payload)
  switch (type) {

    // Remove all messages, join a room and
    // leave all other rooms
    case actionTypes.CHANGE_ROOM: {
      $messages.innerHTML = ''
      const { roomId } = payload
      dispatch(joinRoom(roomId))(socket)
      rooms.push(roomId)
      // @TODO must be done automatically by server
      rooms.forEach((room) => dispatch(leaveRoom(room))(socket))
      break
    }

    // Display new message on wall
    case actionTypes.SEND_MESSAGE: {
      const { message } = payload
      const randomColor = messagesColors[Math.floor(Math.random() * 4)]
      // @TODO display date in a <span>
      // + use an helper to add new message on UI
      $messages.innerHTML += `
        <li
          style="background-color: ${randomColor}"
          class="messages__single"
          data-date="at ${moment(message.createAt).format('h:mm a')}"
        >
          ${message.value}
        </li>
      `
      break
    }

    // Display all old messages
    case actionTypes.GET_ALL_MESSAGES: {
      const { messages } = payload
      const randomColor = messagesColors[Math.floor(Math.random() * 4)]
      $messages.innerHTML = messages.map((message) => `
        <li
          style="background-color: ${randomColor}"
          class="messages__single"
          data-date="at ${moment(message.createAt).format('h:mm a')}"
        >
          ${message.value}
        </li>
      `).join('')
      break
    }

  }
})(socket)



// // Get all previous message
// socket.on('previous messages', (messages) => {
//   $messages.innerHTML = messages.map((message) => `
//   <li
//     style="
//       margin:
//         ${Math.random() + 1}rem
//         ${Math.random() * 3 + 1}rem
//         ${Math.random() + 1}rem
//         ${Math.random() + 1}rem;
//       background-color: ${messagesColors[Math.floor(Math.random() * 4)]};
//     "
//     class="messages__single"
//     data-date="at ${moment(message.date).format('h:mm a')}"
//   >
//     ${message.msg}
//   </li>
//   `).join('')
// })
//
// socket.on('previous rooms', (data) => {
//   $rooms.innerHTML = data.roomIds.map((roomId) => `
//     <div id="${roomId}" class="rooms__single">${roomId}</div>
//   `).join('')
//   data.roomIds.map((roomId) => {
//     rooms.push(roomId)
//   })
// })
//
// // Get last message

//
// // Listen for new rooms creations
// socket.on('add room', (data) => {
//   $rooms.innerHTML += `
//   <div id="${data.roomId}" class="rooms__single">${data.roomName}</div>
//   `
// })
//
// // Join room
// $rooms.addEventListener('click', (event) => {
//   const roomId = event.target.id
//   $messages.innerHTML = ''
//   rooms.forEach((room) => {
//     socket.emit('leave room', room)
//   })
//   socket.emit('join room', {roomId})
//   rooms.push(roomId)
// })
