const Koa = require( 'koa' )
const IO = require( 'koa-socket' )

const app = new Koa()
const io = new IO()

// Attach the socket to the application
io.attach( app )

// Socket is now available as app.io if you prefer
app.io.on( event, eventHandler )

// The raw socket.io instance is attached as app._io if you need it
app._io.on( 'connection', sock => {
  // ...
})

// app.listen is mapped to app.server.listen, so you can just do:
app.listen( process.env.PORT || 3000 )

// *If* you had manually attached an `app.server` yourself, you should do:
app.server.listen( process.env.PORT || 3000 )
