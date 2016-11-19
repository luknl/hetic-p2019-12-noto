/* @flow */

export const JOIN_ROOM: string = 'JOIN_ROOM'
export const LEAVE_ROOM: string = 'LEAVE_ROOM'
export const CHANGE_ROOM: string = 'CHANGE_ROOM'
export const SEND_MESSAGE: string = 'SEND_MESSAGE'
export const GET_ALL_MESSAGES: string = 'GET_ALL_MESSAGES'

type Action = {
  type: string,
  payload: Object,
}

type Message = {
  value: string,
  roomId: number,
  createAt: Date,
}

export const joinRoom = (roomID: number): Action => ({
  type: JOIN_ROOM,
  payload: { roomID },
})

// @TODO: type check room
export const leaveRoom = (room: any): Action => ({
  type: LEAVE_ROOM,
  payload: { room },
})

export const sendMessage = (message: Message): Action => ({
  type: SEND_MESSAGE,
  payload: { message },
})
