const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 3000
const firebase = require("firebase")

const crypto = require("crypto")
const hash = crypto.createHash("sha256")

const config = {
    apiKey: "AIzaSyBwvplEeaV5kqrvqk702CX1EI0iJCHI_JA",
    authDomain: "livepoll-bbfa0.firebaseapp.com",
    databaseURL: "https://livepoll-bbfa0.firebaseio.com",
    projectId: "livepoll-bbfa0",
    storageBucket: "",
    messagingSenderId: "315036492171"
}
firebase.initializeApp(config)

const database = firebase.database()

app.use(express.static(__dirname + "/public"))

const onConnection = socket => {
    const { query, address } = socket.handshake
    const { session } = query
    const sessionPath = `sessions/${session}`

    hash.update(address)
    const hashedAddress = hash.digest("hex")


    socket.on("vote", ({ phase, data }) =>
        database.ref(`${sessionPath}/${phase}/${address}`).set(data)
    )

    const sendData = data => {
        // console.log("sending data", data.val())
        socket.emit(sessionPath, data.val() || [], hashedAddress)
    }
    const sessionRef = database.ref(sessionPath)

    sessionRef.on("value", sendData)
    socket.on("disconnect", () => sessionRef.off("value", sendData))
}

io.on("connection", onConnection)

http.listen(port, () => console.log("listening on port " + port))
