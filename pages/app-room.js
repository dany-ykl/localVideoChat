var app = new Vue ({
    el: '#main-container',

    data () {
        return {
            nameRoom: location.href.split("/").slice(-1).toString(),
            socket: io('http://localhost:7300'),
            infoRoom: [],
            message: '',
            userRoom: []
        }
    },

    

    methods: {

        connnectRoom: function () {
            this.socket.emit('connectRoom', `${this.nameRoom}`)
            console.log('client:Socket connect')
            this.socket.emit('message', {data:{message: 'Hello', room: this.nameRoom}})
        },
        searchRoom: function (data) {
            for (let i of data.data) {
                if (i.nameRoom == this.nameRoom) this.infoRoom.push(i)
            }
            
        },

        getInfoRoom: function() {
            this.socket.emit('infoRoom')
            this.socket.on('infoRoom', (data) => {this.searchRoom(data)})
        },

        sendSms: function () {
            this.socket.emit('newMessage', {data: {room:this.nameRoom, message: this.message}})
            this.socket.on('newMessage', (data) => {
                console.log(data)
            })
        },

        getNameUser: function () {
            let name = window.prompt('Введите имя:')
            this.socket.emit('nameUser', {data: {nameUser: name, nameRoom: this.nameRoom}})
            this.socket.on('nameUser', (data) => {
                for (let i of data) {
                    if (i.nameRoom == this.nameRoom) {
                        if (this.userRoom.indexOf(i.nameUser) == -1) {
                            this.userRoom.push(i.nameUser)
                        this.$refs.line.innerHTML += `<p>&nbsp;&#9885;&nbsp;${i.nameUser}`
                    }
                    }
                }
            })
        }

    },
    created() {
            this.getInfoRoom()
            this.connnectRoom()
            this.getNameUser()

            this.socket.on('message', (data) => {
                console.log('Received')
                console.log(data)
            })
            
    }
});