const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var fs = require('fs');

rooms = []
userRoom = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

})

app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/pages'));

function createRoom(data) {
    var copyData = JSON.parse(data.data);
    rooms.push(copyData)
    var htmlContent = fs.readFileSync("temp.txt", 'utf-8')
    
    fs.writeFile(`${copyData.nameRoom}.html`, htmlContent, (err) => {
        if (err) throw err;
        console.log('Error')
        app.use((req, res) => {
            res.sendFile(__dirname + `/${copyData.nameRoom}.html`)})
    })
    

};

let broadcaster;

io.on('connection', (socket) => {
    var user = []
    user.push(socket)
    console.log('connected');

    socket.on('jsonData', (data) => {
        createRoom(data)
    });

    socket.on('infoRoom', (data) => {
        socket.emit('infoRoom', {data: rooms})
    });

    socket.on('connectRoom', (room) => {
        socket.join(room)
        console.log('server: socket connect')
        socket.on('message', (info) => {
            let data = info.data
            socket.broadcast.to(data.room).emit('message', data.message)
            console.log('send')
        })
    });

    socket.on('newMessage', (info) => {
        let data = info.data
        io.to(data.room).emit('newMessage', data.message)

    });

    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
      });

    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
      });

    socket.on("disconnect", () => {
        for (let i of userRoom) {
            let index = userRoom.indexOf(i) 
            if (i.id == socket.id) {
                userRoom.splice(index, 1)
            }
        }
        socket.to(broadcaster).emit("disconnectPeer", socket.id);

      });

    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    socket.on("answer", (id, message) => {
      socket.to(id).emit("answer", socket.id, message);
    });

    socket.on("candidate", (id, message) => {
      socket.to(id).emit("candidate", socket.id, message);
    });
    
    socket.on('nameUser', (info) => {
        let data = info.data
        userRoom.push({nameRoom: data.nameRoom, nameUser: data.nameUser, id: socket.id})

        io.to(data.nameRoom).emit('nameUser', userRoom)
        
    })
    

    

});

server.listen(7300, () => {
    console.log('Server listening')
});

