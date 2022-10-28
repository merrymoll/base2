const env = process.env.NODE_ENV
let ip = 'localhost'
if (env !== 'development') {
    ip = '192.168.2.2'
}

module.exports = {
    WS_SERVER: `ws://${ip}:9249/data`
}
