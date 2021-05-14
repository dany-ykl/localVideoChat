Vue.component("modal", {
    template: "#modal-template",
    methods: {
        copyLink: function () {
            try {
            let linkRoom = document.getElementById('link-room').textContent;
            navigator.clipboard.writeText(linkRoom)
            } catch (e) {
                throw e
            }
        }
    }
});


var app = new Vue ({
    el: '#main-container',
    data() {
        return {
        notLimit: true,
        numberPart: 0,
        password: '',
        nameRoom: '',
        adminName: '',
        showModal: false,
        numberPartPopup: ''
        }
    },

    methods: {

        
        generateNameRoom: function (){
	        var length = 6,
	        charset = "abcdefghijklmnopqrsEWXYZ0123456789";
	        res = '';
	        for (var i = 0, n = charset.length; i < length; ++i) {
		        res += charset.charAt(Math.floor(Math.random() * n));
	        }
	        return res;
    }
        ,
        createRoom: function () {
            if (this.nameRoom == '') {
                this.nameRoom = this.generateNameRoom()
                
            }
            let numberPart = 0;
            if (this.numberPart == 0 || this.numberPart < 0) {
                numberPart = 50
                this.numberPartPopup = 'Не ограничено'
            }
            else numberPart = this.numberPart;
            if (this.adminName == '') return
            var dataRoom = {
                numberPart: numberPart,
                password: this.password,
                nameRoom: this.nameRoom,
                adminName: this.adminName 
            }
            var json = JSON.stringify(dataRoom);
            this.showModal = true

            const socket = io('http://localhost:7300');
            socket.emit('jsonData', {data: json});
        },


    }

})
