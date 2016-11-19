/* @flow */

type Action = {
  type: string,
  payload: Object,
}

export const watch = (callback: Function): Function => {
  return (socket) => {
    socket.on('dispatch', (action: Action) => {
      callback(action)
    })
  }
}

export const dispatch = (action: Action): Function  => {
  return (socket) => {
    socket.emit('dispatch', action)
  }
}
