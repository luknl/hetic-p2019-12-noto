/* @flow */

import moment from 'moment'
import io from 'socket.io-client'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User, Room } from '@shared/modules/notoSpace/types'

// Initialyze sockets
const socket = io('http://localhost:8080')

// Get actions and actionTypes
const { joinRoom, generateUser, ...actionTypes } = actions

// Select DOM elements
const $messages: HTMLElement = document.querySelector('.messages')
const $rooms: HTMLElement = document.querySelector('.rooms')
const $user: HTMLElement = document.querySelector('.user')

// Initialyze colors
const COLORS: Array<string> = ['#457DF3', '#FC1B1F', '#1AB05A', '#FDBD2C']

// Initialyze state
type State = {
  rooms: Array<Room>,
  user?: User,
}
const state: State = {
  rooms: [],
}


/**
 * Generate an userId
 */
dispatch(generateUser())(socket)


/**
 * When an user wants to go to another room,
 * prevent user, save in local state and
 * update UI
 */
$rooms.addEventListener('click', ({ target }: Event) => {
  const room = state.rooms.find((room) => target.id && room.id === target.id)
  if (!room) return
  dispatch(joinRoom(room))(socket)
  $messages.innerHTML = ''
  state.rooms.push(room)
})


/**
 * Listen socket events with custom watch
 * helper
 */
watch(({ type, payload }) => {
  switch (type) {

    /**
     * Add a user
     */
    case actionTypes.ADD_USER: {
      if (!state.user) {
        const { user } = payload
        $user.innerHTML = `userId: ${user.id}`
        state.user = user
      }
      break
    }


    /**
     * Change room
     */
    case actionTypes.CHANGE_ROOM: {
      // Remove all messages
      $messages.innerHTML = ''
      // Push and join room
      const { roomId } = payload
      dispatch(joinRoom(roomId))(socket)
      state.rooms.push(roomId)
      break
    }


    /**
     * Receive a message
     */
    case actionTypes.SEND_MESSAGE: {
      // Display new message on wall
      const { message } = payload
      const randomColor = COLORS[Math.floor(Math.random() * 4)]
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


    /**
     * Receive all messages
     */
    case actionTypes.GET_ALL_MESSAGES: {
      // Display all message on wall
      const { messages } = payload
      const randomColor = COLORS[Math.floor(Math.random() * 4)]
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


    /**
     * Receive all rooms
     */
    case actionTypes.GET_ALL_ROOMS: {
      // Display all rooms on wall
      const { rooms } = payload
      state.rooms = rooms
      $rooms.innerHTML = rooms.map((room) => `
        <div id="${room.id}" class="rooms__single">${room.name}</div>
      `).join('')
      break
    }


    /**
     * Add new room
     */
    case actionTypes.ADD_ROOM: {
      const { room } = payload
      $rooms.innerHTML += `
        <div id="${room.id}" class="rooms__single">
          ${room.name}
        </div>
      `
      break
    }

  }
})(socket)
