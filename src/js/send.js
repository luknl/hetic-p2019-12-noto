/* @flow */

import io from 'socket.io-client'
import { dispatch, watch } from '@helpers/socket'
import { sendMessage } from './bundles/notoSpace/actions'

// Initialyze sockets
const socket = io('http://localhost:8080')

// Select DOM elements
const $messageForm: HTMLElement = document.querySelector('.message__form')
const $messageInput: HTMLInputElement = document.querySelector('.message__form__input')
const $roomForm: HTMLElement = document.querySelector('.room__form')
const $codeForm: HTMLElement = document.querySelector('.code__form')
const $infosList: HTMLElement = document.querySelector('.infos')
const $rooms: HTMLElement = document.querySelector('.rooms')


let desktopSocketId = ''
let urlId = ''
let stateRoomId = ''
let roomsList = []



// Set initial state
type State = { roomId: number }
const state: State = {
  roomId: -1,
}

// A user clicks to send a message
$messageForm.addEventListener('submit', (e: Event): boolean => {
  e.preventDefault()
  const { value } = $messageInput
  const { roomId } = state
  const message = { value, roomId, createAt: new Date() }
  dispatch(sendMessage(message))(socket)
  $messageInput.value = ''
  return false
})

// Listen socket events
watch(({ type, payload }) => {
  console.log(type, payload)
  switch (type) {
    default:
  }
})(socket)














// Add previous rooms to the DOM
socket.on('previous rooms', (data) => {
  $rooms.innerHTML = data.roomIds.map((roomId) => `
    <div id="${roomId}" class="rooms__single">${roomId}</div>
  `).join('')
  data.roomIds.map((roomId) => {
    roomsList.push(roomId)
  })
})

// Join room
$rooms.addEventListener('click', (event) => {
  const roomId = event.target.id
  roomsList.forEach((room) => {
    socket.emit('leave room', room)
  })
  // Change roomId state
  stateRoomId = roomId
  console.log(roomId)
  socket.emit('join room', {roomId, desktopSocketId})
  roomsList.push(roomId)
})


// Add room form
$roomForm.addEventListener('submit', (event) => {
  event.preventDefault()
  stateRoomId = document.querySelector('#room__form-input').value.replace(/[^A-Z0-9]/ig, '_')
  // Query room creation
  socket.emit('create room', {
    roomName: document.querySelector('#room__form-input').value,
    roomId: stateRoomId,
    desktopSocketId,
    urlId,
  })
  // Reset input
  document.querySelector('#room__form-input').value = ''
  return false
})

$codeForm.addEventListener('submit', (event) => {
  event.preventDefault()
  //  Send infos
  socket.emit('get user', { urlId: document.getElementById('code__input').value })
})

// Get user infos
socket.on('user infos', (infos) => {
  if (typeof infos == 'string') {
    document.querySelector('.code__error').innerHTML = `${infos}`
  } else {
    document.querySelector('.code').style.display = 'none'
    desktopSocketId = infos[0].desktopSocketId
    urlId = infos[0].urlId
    $infosList.innerHTML += `
    <li>Desktop Socket ID: ${infos[0].desktopSocketId}</li>
    <li>urlId: ${infos[0].urlId}</li>
    `
  }
})
