const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync("db.json")
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ sessions: {} }).write()

const onConnection = socket => {
    const { session } = socket.handshake.query

    socket.on("vote", ({ phase, user, data }) => {
        console.log(phase, user, data)
        db.set(`sessions.${session}.${phase}.${user}`, data).write()
        const newValue = db.get(`sessions.${session}`).value()
        io.emit(`sessions.${session}`, newValue)
    })

    const data = db.get(`sessions.${session}`, []).value()
    socket.emit(`sessions.${session}`, data)
}

io.on("connection", onConnection)

http.listen(port, () => console.log("listening on port " + port))
