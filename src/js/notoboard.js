import moment from 'moment'
const socket = io()
const $messages = document.querySelector('.messages')
const $rooms = document.querySelector('.rooms')
let $roomsElements = document.querySelectorAll('.rooms__single')
let roomsList = []
const messagesColors = ['#457DF3', '#FC1B1F', '#1AB05A', '#FDBD2C']

document.addEventListener('DOMContentLoaded', () => {
  // Generate ID
  const urlId = Math.floor(Math.random()*1000)

  // Inject client ID url
  document.querySelector('.url-connection').innerHTML = `<a href="http://localhost:3000/send/${urlId}" target="_blank" >http://localhost:3000/send/${urlId}</a>`

  // Link user to an ID
  socket.emit('new user', {urlId, currentRoom: 'mainRoom'})
})
socket.on('change room', (data) => {
  console.log('Change room requested', data.roomId)
  $messages.innerHTML = ''
  roomsList.forEach((room) => {
    socket.emit('leave room', room)
  })
  socket.emit('join room', {roomId: data.roomId})
  roomsList.push(data.roomId)
})
// Get all previous message
socket.on('previous messages', (messages) => {
  $messages.innerHTML = messages.map((message) => `
  <li
    style="
      margin:
        ${Math.random() + 1}rem
        ${Math.random() * 3 + 1}rem
        ${Math.random() + 1}rem
        ${Math.random() + 1}rem;
      background-color: ${messagesColors[Math.floor(Math.random() * 4)]};
    "
    class="messages__single"
    data-date="at ${moment(message.date).format('h:mm a')}"
  >
    ${message.msg}
  </li>
  `).join('')
  console.log(messages)
})

socket.on('previous rooms', (data) => {
  $rooms.innerHTML = data.roomIds.map((roomId) => `
    <div id="${roomId}" class="rooms__single">${roomId}</div>
  `).join('')
  data.roomIds.map((roomId) => {
    roomsList.push(roomId)
  })
})

// Get last message
socket.on('chat message', (message) => {
  $messages.innerHTML += `
    <li
      style="
        margin:
          ${Math.random() + 1}rem
          ${Math.random() * 3 + 1}rem
          ${Math.random() + 1}rem
          ${Math.random() + 1}rem;
        background-color: ${messagesColors[Math.floor(Math.random() * 4)]};
      "
      class="messages__single"
      data-date="at ${moment(message.date).format('h:mm a')}"
    >
      ${message.msg}
    </li>
  `
})

// Listen for new rooms creations
socket.on('add room', (data) => {
  $rooms.innerHTML += `
  <div id="${data.roomId}" class="rooms__single">${data.roomName}</div>
  `
})

// Join room
$rooms.addEventListener('click', (event) => {
  const roomId = event.target.id
  console.log(roomId)
  $messages.innerHTML = ''
  roomsList.forEach((room) => {
    socket.emit('leave room', room)
  })
  socket.emit('join room', {roomId})
  roomsList.push(roomId)
})
