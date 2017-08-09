function startWebSocketServer() {
  const net = require('net')
  const http = require('http')
  const url = require('url')
  const path = require('path')
  const ws = require('websocket-stream')
  const pipe = require('multipipe')
  const dgram = require('dgram')
  const noop = () => {}
  const port = process.env.PORT || 1337
  const verifyRequest = (req, res) => {
    if (req.upgrade) return
    res.statusCode = 404
    res.end('Not found')
  }
  const httpServer = http.createServer(verifyRequest)
  const wsServer = ws.createServer({
    server: httpServer
  }, function(remote, request) {
    const requestType = request.url.replace("/", "") || "TCP"
    if (requestType == "TCP") {
      const target = net.createConnection(1080, "127.0.0.1")
      target.on('connect', () => {
        pipe(remote, target, noop)
        pipe(target, remote, noop)
      })
    }
  })
  httpServer.listen(port, (err) => {
    if (err) showError(err)
    else console.info('Server is listening on ' + port)
  })
  wsServer.on("connection", function(wsocket, req) {
    const requestType = req.url.replace("/", "") || "TCP"
    if (requestType== "UDP") {
      var udp = dgram.createSocket("udp4")
      ws.on('message', function(message) {
        udp.send(message, 0, message.length, "127.0.0.1", port)
      })
      udp.on('message', function(msg) {
        wsocket.send(msg)
      })
    }
  })
}

function startSocksServer() {
  setTimeout(function() {
    require("./proxy")
  }, 0)
}
startSocksServer()
startWebSocketServer()
