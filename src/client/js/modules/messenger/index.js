/* @flow */

import io from 'socket.io-client'
import { SOCKET_URL } from '@shared/config'
import { isMobile } from  '@helpers/browser'
import { dispatch, watch } from '@shared/helpers/socket'
import * as actions from '@shared/modules/notoSpace/actions'
import type { User, Room } from '@shared/modules/notoSpace/types'
import MessengerUI from './MessengerUI'

export default () => {

  // If user is on desktop, redirect it to space page
  if (!isMobile()) window.location.href = 'space.html'

  // Get actions and actionTypes
  const {
    connectUser, sendMessage, initializeRoom, joinRoom,
    startTyping, stopTyping, ...actionTypes,
  } = actions

  // Initialyze sockets
  const socket = io(SOCKET_URL)

  // Set initial state
  type State = { user?: User, rooms: Array<Room> }
  const state: State = { rooms: [] }

  // Get browser language
  const language: string = navigator.language || navigator.userLanguage
  const country: string = language.slice(-2)

  // Connect client to desktop client
  MessengerUI.onLogin((userId) => {
    dispatch(connectUser(userId))(socket)
  })

  // Add popup support
  MessengerUI.runPopup()
  MessengerUI.onPressController((name) => {
    MessengerUI.openPopup(name)
  })

  // Create a room
  MessengerUI.onCreateRoom((value) => {
    dispatch(initializeRoom(value))(socket)
    MessengerUI.closePopup('room')
  })

  // Send a message
  MessengerUI.onSendMessage((value) => {
    if (!state.user || !value) return
    // Build message
    const { roomId } = state.user
    const message = { value, roomId, createAt: new Date(), country }
    // Send it to server
    dispatch(sendMessage(message))(socket)
    // Update UI
    MessengerUI.resetMessageInput()
    MessengerUI.closePopup('message')
  })


  // Join room
  MessengerUI.onJoinRoom((roomId) => {
    const { user } = state
    const room = state.rooms.find(({ id }) => id === roomId)
    if (!room) return
    if (!state.user || !user) return
    state.user.roomId = roomId
    dispatch(joinRoom(room, state.user))(socket)
    MessengerUI.activeRoom(roomId)
  })

  // Send user typing
  let writing = false
  MessengerUI.onTypeMessage((value) => {
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

      // Server says if connection is ok
      case actionTypes.GET_USER: {
        // Test if user has already been connected
        if (state.user) return
        const { user } = payload
        // Server returns an error
        if (!user) return MessengerUI.displayLoginError('Error, please retry !')
        // Save user
        MessengerUI.activeRoom(user.roomId)
        MessengerUI.removeLoginForm()
        state.user = user
        break
      }

      // Receive all rooms
      case actionTypes.GET_ALL_ROOMS: {
        // Display all rooms
        const { rooms } = payload
        state.rooms = rooms
        MessengerUI.addRooms(state.user, rooms)
        break
      }

      // Join a room
      case actionTypes.JOIN_ROOM: {
        const { user } = payload
        if (!state.user) return
        const { id } = state.user
        if (id && user.id !== id) return
        state.user.roomId = user.roomId
        MessengerUI.activeRoom(user.roomId)
        break
      }

      // Create a room
      case actionTypes.CREATE_ROOM: {
        const { room } = payload
        state.rooms.push(room)
        MessengerUI.addRoom(state.user, room)
        break
      }

    }
  })(socket)

}
