/* @flow */

export type Action = {
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

export const dispatch = (...actions: Array<Action>): Function  => {
  return (socket, options: { to: ?number }) => {
    const { to } = options || {}
    actions.forEach((action) => {
      if (to) {
        socket.to(to).emit('dispatch', action)
      } else {
        socket.emit('dispatch', action)
      }
    })
  }
}
