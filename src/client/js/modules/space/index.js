/* @flow */

import moment from 'moment'
import io from 'socket.io-client'
import { flag } from 'country-code-emoji'
import { SOCKET_URL } from '@shared/config'
import { isMobile } from  '@helpers/browser'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User, Room } from '@shared/modules/notoSpace/types'

export default () => {

    // If user is on desktop, redirect it to space page
    if (isMobile()) window.location.href = 'messenger.html'

    // Initialyze sockets
    const socket = io(SOCKET_URL)

    // Get actions and actionTypes
    const { joinRoom, generateUser, ...actionTypes } = actions

    // Select DOM elements
    const $messages: HTMLElement = document.querySelector('.messages')
    const $rooms: HTMLElement = document.querySelector('.rooms')
    const $user: HTMLElement = document.querySelector('.user')
    const $userId: HTMLElement = document.querySelector('#user_id')
    const $writers: HTMLElement = document.querySelector('.writers')

    // Initialyze colors
    const COLORS: Array<string> = ['#457DF3', '#FC1B1F', '#1AB05A', '#FDBD2C']

    // Initialyze state
    type State = {
      rooms: Array<Room>,
      user?: User,
      countries: {},
    }
    const state: State = {
      rooms: [],
      countries: {},
    }


    /**
     * Generate an userId
     */
    const language = navigator.language || navigator.userLanguage
    dispatch(generateUser(language))(socket)


    /**
     * Listen socket events with custom watch
     * helper
     */
    watch(({ type, payload }) => {
      console.log({ type, payload })
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
            $userId.innerHTML = `${user.id}`
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
              style="background-color: ${randomColor}; font-size: ${message.value.length <= 6 ? 1.7 : .7}rem; margin: ${Math.random() * 3 + 1}rem ${Math.random() * 3 + 1}rem 0 0"
              class="message"
              data-date="from ${message.country} at ${moment(message.createAt).format('h:mm a')}"
            >
              ${message.value}
            </li>
          `
          // Scroll to bottom
          $messages.scrollTop = $messages.scrollHeight
          break
        }


        /**
         * Receive all messages
         */
        case actionTypes.GET_ALL_MESSAGES: {
          const { messages } = payload
          // Display all message on wall
          $messages.innerHTML = messages.map((message) => `
            <li
              style="background-color: ${COLORS[Math.floor(Math.random() * 4)]}; font-size: ${message.value.length <= 6 ? 1.7 : .7}rem; margin: ${Math.random() * 3 + 1}rem ${Math.random() * 3 + 1}rem 0 0"
              class="message"
              data-date="from ${message.country} at ${moment(message.createAt).format('h:mm a')}"
            >
              ${message.value}
            </li>
          `).join('')
          state.messagesAreInitialized = true
          // Scroll to bottom
          $messages.scrollTop = $messages.scrollHeight
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
            <div id="${room.id}" class="room">${room.name}</div>
          `).join('')
          return
        }


        /**
         * Add new room
         */
        case actionTypes.CREATE_ROOM: {
          const { room } = payload
          $rooms.innerHTML += `
            <div id="${room.id}" class="room">
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

        case actionTypes.START_TYPING: {
          const { user } = payload
          if (!state.countries[user.language] ||!document.querySelector(`#${user.language}`)) {
            state.countries[user.language] = { count: 1 }
            $writers.innerHTML += `
              <ul class="${user.language} writers__single" id="${user.language}">
                <div class="writers__dots">
                  <div class="writers__dot writers__dot--1"></div>
                  <div class="writers__dot writers__dot--2"></div>
                  <div class="writers__dot writers__dot--3"></div>
                </div>
                <div class="writers__flag" data-count="${state.countries[user.language].count}">
                  ${flag(user.language.slice(-2))}
                </div>
              </ul>
            `
          } else {
            state.countries[user.language].count++
            document.querySelector(`.${user.language}`).setAttribute('data-count', state.countries[user.language].count)
          }
          break
        }

        case actionTypes.STOP_TYPING: {
          const { user } = payload
          state.countries[user.language].count--
          if (state.countries[user.language].count === 0 && document.querySelector(`#${user.language}`)) {
            document.querySelector(`#${user.language}`).outerHTML = ''
          }
          break
        }

      }
    })(socket)

}
