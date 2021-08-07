const div = document.getElementById("ChatBox")
const sendChat = (msg) => {
    const div = document.getElementById("ChatBox")
    var span = document.createElement("p")
    console.log("here")
    span.innerHTML = msg.name + ": " + msg.msg
    span.setAttribute("class", "chat")
    div.appendChild(span)
}
const sock = io();
whichServerAmIIn = ""
let nam = window.name
if (window.name == "") {
    sock.emit('set-recc')
}
sock.emit('set-rec')
sock.on('message', (text, User) => {
    console.log(text)
    if (div != null) {
        sendChat(text, User)
    }

})
sock.on("logs", function(result) {
    console.log(result)
    result.forEach(result => {
        console.log(result)
        if (result.room == whichServerAmIIn) {
            sendChat(result)
        }
    });
})
sock.on('set-reclen', function(reg) {
    console.log(reg)
    whichServerAmIIn = reg
})
sock.on('set-recname', function(name) {

    window.name = name
    console.log(name)
})

function send() {
    const div = document.getElementById("ChatBox")
    if (div != null) {
        console.log("ez")
        var mat = document.getElementById("inp")
        var y = mat.value
        mat.value = ""
        console.log(nam)
        console.log(whichServerAmIIn)
        sock.emit('message', y, nam, whichServerAmIIn)
    }
}
