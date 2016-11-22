/* @flow */

import io from 'socket.io-client'
import { SOCKET_URL } from '@shared/config'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User, Room } from '@shared/modules/notoSpace/types'
import MessengerUI from './MessengerUI'

export default () => {

  // Get actions and actionTypes
  const {
    connectUser, sendMessage, initializeRoom, joinRoom,
    startTyping, stopTyping, ...actionTypes,
  } = actions

  // Initialyze sockets
  const socket = io(SOCKET_URL)

  // Select DOM elements
  const $messageForm: HTMLElement = document.querySelector('.popup__form--message')
  const $messageInput: HTMLInputElement = $messageForm.querySelector('input')
  const $roomForm: HTMLElement = document.querySelector('.popup__form--room')
  const $roomInput: HTMLInputElement = $roomForm.querySelector('input')
  const $rooms: HTMLElement = document.querySelector('.rooms')

  // Set initial state
  type State = { user?: User, rooms: Array<Room> }
  const state: State = { rooms: [] }

  // Get browser language
  const language = navigator.language || navigator.userLanguage
  const country = language.slice(-2)


  /**
   * Connect client to desktop client
   */
  MessengerUI.onLogin((userId) => {
    dispatch(connectUser(userId))(socket)
  })


  /**
   * Manage popups
   */
  MessengerUI.onPressController((name) => {
    MessengerUI.openPopup(name)
  })


  /**
   * Send a message
   */
  MessengerUI.onSendMessage((value) => {
    if (!state.user || !value) return
    // Build message and send it to server
    const { roomId } = state.user
    const message = { value, roomId, createAt: new Date(), country }
    dispatch(sendMessage(message))(socket)
    MessengerUI.resetMessageInput()
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
    if (!e.target || !e.target.id) return
    const roomId = parseInt(e.target.id)
    const { user } = state
    const room = state.rooms.find(({ id }) => id === roomId)
    if (!room) return
    if (!state.user || !user) return
    state.user.roomId = roomId
    dispatch(joinRoom(room, state.user))(socket)
  })

  /**
   * Send user typing
   */
  let writing = false
  $messageInput.addEventListener('keyup', () => {
    const { value } = $messageInput
    const { user } = state
    if (!user) return
    if (!writing && value !== '') {
      writing = true
      dispatch(startTyping(user))(socket)
    } else if(value === '') {
      writing = false
      dispatch(stopTyping(user))(socket)
    }
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
        if (!user) return MessengerUI.displayLoginError('Error, please retry !')
        // Save user
        MessengerUI.removeLoginForm()
        state.user = user
        break
      }


      /**
       * Receive all rooms
       */
      case actionTypes.GET_ALL_ROOMS: {
        // Display all rooms
        const { rooms } = payload
        state.rooms = rooms
        MessengerUI.addRooms(rooms)
        break
      }


      /**
       * Join a room
       */
      case actionTypes.JOIN_ROOM: {
        const { user } = payload
        if (!state.user) return
        const { id } = state.user
        if (id && user.id !== id) return
        state.user.roomId = user.roomId
        break
      }


      /**
       * Create a room
       */
      case actionTypes.CREATE_ROOM: {
        const { room } = payload
        state.rooms.push(room)
        MessengerUI.addRoom(room)
        break
      }

    }
  })(socket)

}
