const socket = io()
const $messageForm = document.querySelector('.message__form')
const $roomForm = document.querySelector('.room__form')
const $codeForm = document.querySelector('.code__form')
const $infosList = document.querySelector('.infos')
const $rooms = document.querySelector('.rooms')
let desktopSocketId = ''
let urlId = ''
let stateRoomId = ''
let roomsList = []

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

// Send message form
$messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Sending message to room:', stateRoomId)
  // Send message to sever
  socket.emit('chat message', {
    roomId: stateRoomId,
    msg: document.querySelector('#message__form-input').value,
    date: new Date(),
  })
  // Reset input
  document.querySelector('#message__form-input').value = ''
  return false
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
