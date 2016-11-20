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
        $user.innerHTML = `
          <li>userId: ${user.id}</li>
          <li>roomId: ${user.roomId}</li>
        `
        state.user = user
      }
      break
    }


    /**
     * Receive a message
     */
    case actionTypes.SEND_MESSAGE: {
      const { message } = payload
      // Security: check room
      if (message.roomId !== state.user.roomId) return
      // Display new message on wall
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
      const { messages } = payload
      // Display all message on wall
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
      state.messagesAreInitialized = true
      return
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
      return
    }


    /**
     * Add new room
     */
    case actionTypes.CREATE_ROOM: {
      const { room } = payload
      $rooms.innerHTML += `
        <div id="${room.id}" class="rooms__single">
          ${room.name}
        </div>
      `
      break
    }

    /**
     * Join a room
     */
    case actionTypes.JOIN_ROOM: {
      const { user, room } = payload
      if (state.user.id !== user.id ) return
      // Connect desktop to room
      dispatch(joinRoom(room, user))(socket)
      // Update state and UI
      state.user.roomId = user.roomId
      $messages.innerHTML += ''
      $user.innerHTML = `
        <li>id: ${user.id}</li>
        <li>roomId: ${user.roomId}</li>
      `
      break
    }

  }
})(socket)
