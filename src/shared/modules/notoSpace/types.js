/* @flow */

export type Message = {
  value: string,
  roomId: number,
  createAt: Date,
  country: string,
}

export type User = {
  id: number,
  roomId: number,
  previousRoomId?: number,
  isConnected: boolean,
  language?: string,
}

export type Room = {
  id: number,
  name: string,
}
