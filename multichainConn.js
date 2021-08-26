const multichain = require('multichain-node')({

    port: 7190,
    host: '127.0.0.1',
    user: "multichainrpc",
    pass: "E65t6QyMAWUUqWVj6NqAVWT2Vt4gaXQdAAZc2grbjuhn"

})

module.exports = multichain;