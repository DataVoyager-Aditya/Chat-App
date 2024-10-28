const io = require('socket.io')(8000,{cors:{origin:"*"}});

const users = {}

io.on('connection', socket =>{//io.on instance h jo bht sare sockets ko connect krega jse multiple users connect honge un sb ko listen krega
    //if any user joined let other users connected to the server know
    socket.on('new-user-joined', name=>{//jb ek partcular connection hoga to kya krna chahiye
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })
    //if someone sends message broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
    //if someone leaves the chat let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})