/* @flow */

import io from 'socket.io-client'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User, Room } from '@shared/modules/notoSpace/types'

// Get actions and actionTypes
const { connectUser, sendMessage, initializeRoom, joinRoom, ...actionTypes } = actions

// Initialyze sockets
const socket = io('http://localhost:8080')

// Select DOM elements
const $messageForm: HTMLElement = document.querySelector('.message')
const $messageInput: HTMLInputElement = document.querySelector('.message__input')
const $roomForm: HTMLElement = document.querySelector('.room')
const $roomInput: HTMLInputElement = document.querySelector('.room__input')
const $codeForm: HTMLElement = document.querySelector('.code__form')
const $codeInput: HTMLInputElement = document.querySelector('.code__input')
const $codeError: HTMLElement = document.querySelector('.code__error')
const $user: HTMLElement = document.querySelector('.user')
const $rooms: HTMLElement = document.querySelector('.rooms')
const $code: HTMLElement = document.querySelector('.code')

// Set initial state
type State = { user?: User, rooms: Array<Room> }
const state: State = { rooms: [] }


/**
 * Connect client to desktop client
 */
$codeForm.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  const userId = parseInt($codeInput.value)
  dispatch(connectUser(userId))(socket)
})


/**
 * Send a message
 */
$messageForm.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  const { value } = $messageInput
  if (!state.user || !value) return
  // Build message
  const { roomId } = state.user
  const message = { value, roomId, createAt: new Date() }
  // Prevent server
  dispatch(sendMessage(message))(socket)
  // Reset input
  $messageInput.value = ''
})


/**
 * Create a room
 */
$roomForm.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  // Call server to create room
  const roomName = $roomInput.value
  dispatch(initializeRoom(roomName))(socket)
  // Reset input
  $roomInput.value = ''
})


/**
 * Join room
 */
$rooms.addEventListener('click', (e: Event) => {
  e.preventDefault()
  const roomId = parseInt(e.target.id)
  const { user } = state
  const room = state.rooms.find(({ id }) => id === roomId)
  if (!room) return
  state.user.roomId = roomId
  $user.innerHTML = `
    <li>id: ${user.id}</li>
    <li>Desktop Socket ID: ${user.desktopSocketId}</li>
    <li>roomId: ${roomId}</li>
  `
  dispatch(joinRoom(room, state.user))(socket)
})



/**
 * Listen socket events with custom watch
 * helper
 */
watch(({ type, payload }) => {
  switch (type) {

    /**
     * Server says if connection is ok
     * or not
     */
    case actionTypes.GET_USER: {
      // Test if user has already been connected
      if (state.user) return
      const { user } = payload
      // Server returns an error
      if (!user) {
        $codeError.innerHTML = 'Erreur ! :('
        return
      }
      // Save and display user
      if ($code.parentNode) $code.parentNode.removeChild($code)
      state.user = user
      $user.innerHTML += `
        <li>id: ${user.id}</li>
        <li>Desktop Socket ID: ${user.desktopSocketId}</li>
        <li>roomId: ${user.roomId}</li>
      `
      break
    }


    /**
     * Receive all rooms
     */
    case actionTypes.GET_ALL_ROOMS: {
      // Display all rooms
      const { rooms } = payload
      state.rooms = rooms
      $rooms.innerHTML = rooms.map((room) => `
        <li id="${room.id}">${room.name}</li>
      `).join('')
      break
    }


    /**
     * Join a room
     */
    case actionTypes.JOIN_ROOM: {
      const { user } = payload
      if (user.id !== state.user.id) return
      state.user.roomId = user.roomId
      $user.innerHTML = `
        <li>id: ${user.id}</li>
        <li>Desktop Socket ID: ${user.desktopSocketId}</li>
        <li>roomId: ${user.roomId}</li>
      `
      break
    }


    /**
     * Create a room
     */
    case actionTypes.CREATE_ROOM: {
      const { room } = payload
      state.rooms.push(room)
      $rooms.innerHTML += `
        <li id="${room.id}">${room.name}</li>
      `
      break
    }

  }
})(socket)