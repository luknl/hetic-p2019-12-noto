/* @flow */

export type Message = {
  value: string,
  roomId: number,
  createAt: Date,
}

export type User = {
  id: number,
  roomId: number,
  isConnected: boolean,
}

export type Room = {
  id: number,
  name: string,
}
