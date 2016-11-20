/* @flow */

import type { Action } from '@shared/helpers/socket'
import type { Room, User, Message } from './types'

export const GET_USER = 'GET_USER'
export const ADD_USER = 'ADD_USER'
export const ADD_ROOM = 'ADD_ROOM'
export const JOIN_ROOM = 'JOIN_ROOM'
export const LEAVE_ROOM = 'LEAVE_ROOM'
export const CHANGE_ROOM = 'CHANGE_ROOM'
export const CONNECT_USER = 'CONNECT_USER'
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const GENERATE_USER = 'GENERATE_USER'
export const GET_ALL_ROOMS = 'GET_ALL_ROOMS'
export const GET_ALL_MESSAGES = 'GET_ALL_MESSAGES'

export const getUser = (user: ?User): Action => ({
  type: GET_USER,
  payload: user ? { user } : {},
})

export const addUser = (user: User): Action => ({
  type: ADD_USER,
  payload: { user },
})

export const addRoom = (room: Room): Action => ({
  type: ADD_ROOM,
  payload: { room },
})

export const joinRoom = (room: Room): Action => ({
  type: JOIN_ROOM,
  payload: { room },
})

export const leaveRoom = (room: Room): Action => ({
  type: LEAVE_ROOM,
  payload: { room },
})

export const connectUser = (userId: number): Action => ({
  type: CONNECT_USER,
  payload: { userId },
})

export const sendMessage = (message: Message): Action => ({
  type: SEND_MESSAGE,
  payload: { message },
})

export const generateUser = (): Action => ({
  type: GENERATE_USER,
  payload: {},
})

export const getAllRooms = (rooms: Array<Room>): Action => ({
  type: GET_ALL_ROOMS,
  payload: { rooms },
})

export const getAllMessages = (messages: Array<Message>): Action => ({
  type: GET_ALL_MESSAGES,
  payload: { messages },
})
