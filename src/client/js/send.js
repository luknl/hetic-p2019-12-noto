/* @flow */

import io from 'socket.io-client'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User } from '@shared/modules/notoSpace/types'

// Get actions and actionTypes
const { connectUser, sendMessage, ...actionTypes } = actions

// Initialyze sockets
const socket = io('http://localhost:8080')

// Select DOM elements
const $messageForm: HTMLElement = document.querySelector('.message')
const $messageInput: HTMLInputElement = document.querySelector('.message__input')
const $roomForm: HTMLElement = document.querySelector('.room')
const $codeInput: HTMLInputElement = document.querySelector('.code__input')
const $codeForm: HTMLElement = document.querySelector('.code__form')
const $codeError: HTMLElement = document.querySelector('.code__error')
const $user: HTMLElement = document.querySelector('.user')
const $rooms: HTMLElement = document.querySelector('.rooms')
const $code: HTMLElement = document.querySelector('.code')

// Set initial state
type State = { user?: User }
const state: State = {}

// Enter code to connect to client
$codeForm.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  const userId = parseInt($codeInput.value)
  dispatch(
    connectUser(userId),
  )(socket)
})

// Click to send a message
$messageForm.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  if (!state.user) return
  const { value } = $messageInput
  if (!value) return
  const { roomId } = state.user
  const message = { value, roomId, createAt: new Date() }
  dispatch(sendMessage(message))(socket)
  $messageInput.value = ''
})

// Listen socket events
watch(({ type, payload }) => {
  console.log({ type, payload })
  switch (type) {

    // ...
    case actionTypes.GET_USER: {
      if (state.user) return
      const { user } = payload
      if (!user) {
        $codeError.innerHTML = 'Erreur ! :('
        return
      }
      if ($code.parentNode) $code.parentNode.removeChild($code)
      state.user = user
      $user.innerHTML += `
        <li>id: ${user.id}</li>
        <li>Desktop Socket ID: ${user.desktopSocketId}</li>
        <li>roomId: ${user.roomId}</li>
      `
    }
  }
})(socket)



















//
// // Add previous rooms to the DOM
// socket.on('previous rooms', (data) => { // ===> GET_ALL_ROOMS
//   $rooms.innerHTML = data.roomIds.map((roomId) => `
//     <div id="${roomId}" class="rooms__single">${roomId}</div>
//   `).join('')
//   data.roomIds.map((roomId) => {
//     roomsList.push(roomId)
//   })
// })
//
// // Join room
// $rooms.addEventListener('click', (event) => {
//   const roomId = event.target.id
//   roomsList.forEach((room) => {
//     socket.emit('leave room', room)
//   })
//   // Change roomId state
//   stateRoomId = roomId
//   console.log(roomId)
//   socket.emit('join room', {roomId, desktopSocketId})
//   roomsList.push(roomId)
// })
//
//
// // Add room form
// $roomForm.addEventListener('submit', (event) => {
//   event.preventDefault()
//   stateRoomId = document.querySelector('#room__form__input').value.replace(/[^A-Z0-9]/ig, '_')
//   // Query room creation
//   socket.emit('create room', {
//     roomName: document.querySelector('#room__form__input').value,
//     roomId: stateRoomId,
//     desktopSocketId,
//     urlId,
//   })
//   // Reset input
//   document.querySelector('#room__form__input').value = ''
//   return false
// })
//
//

// Get user infos
