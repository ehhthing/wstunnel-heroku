function startWebSocketServer() {
  const net = require('net')
  const http = require('http')
  const url = require('url')
  const path = require('path')
  const ws = require('websocket-stream')
  const pipe = require('multipipe')
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
    const requestType = "TCP"
    console.log(request)
    if (requestType == "TCP") {
      const target = net.createConnection(1080, "127.0.0.1")
      target.on('connect', () => {
        pipe(remote, target, noop)
        pipe(target, remote, noop)
      })
    } else if (requestType == "UDP") {

    } else {
      remote.terminate()
    }
  })
  httpServer.listen(port, (err) => {
    if (err) showError(err)
    else console.info('Server is listening on ' + port)
  })
}

function startSocksServer() {
  setTimeout(function() {
    require("./proxy")
  }, 0)
}
startSocksServer()
startWebSocketServer()
