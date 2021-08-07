const http = require("http");
const express = require("express");
const socketio = require("socket.io")
const mongoose = require("mongoose")
const sha256 = require('js-sha256');

const db = "mongodb+srv://projecter30:batuk1203@cluster0.tuydg.mongodb.net/db-chatlog?retryWrites=true&w=majority"
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then((socket) => {
    console.log("SUCCESS")
})

isLogged = false
namhe = ""
const msgLog = require("./models/model")
const userDB = require('./models/user')
const app = express();
const server = http.createServer(app);
const io = socketio(server)
whichServerAmIIn = ""
app.set('views', './views')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.render('login');
});
const channel = {}
userDB.find().then((result) => {
    result.forEach(result => {
        channel[result.username] = { users: {} }
    })
})


app.get('/message', (req, res) => {
    if (isLogged) {
        res.render('s', { channel: channel })
    } else {
        res.redirect('/')
    }

})
app.get('/:channels', (req, res) => {
    if (isLogged) {
        whichServerAmIIn = req.params.channels
        console.log(whichServerAmIIn)
        res.render('index', { channelName: req.params.channels })
    } else {
        res.redirect('/')
    }

})
app.post('/register', (req, res) => {
    if (req.body.username.length < 5 || req.body.password.lenght < 5) {
        res.redirect('/')
    } else {
        const newUser = new userDB({ username: req.body.username, password: sha256(req.body.password) })
        newUser.save().then(() => {
            console.log("success")
            isLogged = true
            namhe = req.body.username
            console.log("here")
        })

        res.redirect('/message')
    }
})
app.post('/login', (req, res) => {
    userDB.find().then(result => {
        result.forEach(result => {
            if (req.body.username == result.username && sha256(req.body.password) == result.password) {
                isLogged = true
                namhe = req.body.username
                res.redirect('/message')
            }
        });
        res.redirect('/')
    })

})
io.on('connection', socket => {
    console.log("Connected")
    msgLog.find().then((result) => {
        socket.emit('logs', result)
    })
    console.log(namhe)
    socket.on('set-recc', () => {
        socket.emit('set-recname', namhe)
    })
    socket.on('set-rec', () => {
        console.log(whichServerAmIIn)
        socket.emit('set-reclen', whichServerAmIIn)
    })
    socket.on('message', (text, User, Rec) => {
        const msg = new msgLog({ msg: text, name: User, recipient: Rec })
        msg.save().then(() => {
            io.emit('message', msg)
        })
    })
})
server.listen(4000, () => {
    console.log("Listening");
})