//@ts-check

class Chatter {
    constructor({route}){
        this.route = route;
    }
    
    /**
     * @param {any} _socket
     */
    chatWithSocketIo = ({Server, server}) => {
        const io = Server(server, {
            origin: '*',
            methods: ['GET', 'POST']
        })
        
        const connection = io.connect(this.route)

        connection.on('connection', (socket) => {

            socket.on('message', ({senderId, message}) => {
                
            })
        })
    }
}

export default Chatter;