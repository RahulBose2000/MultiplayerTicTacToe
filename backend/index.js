const express = require('express');
const cors = require('cors');
const app=express()
const http=require('http')
const server = http.createServer(app);
const {Server}=require('socket.io');
app.use(cors());
const io=new Server(server,{
    cors:{
        // origin: '*' // allow all origin
        // but you can specify acc to your free port
        origin: 'http://localhost:5500'
    }
});

const PORT = process.env.PORT||3000;


let users = [];
let turn = 'X';
let board = ['','','','','','','','',''];

io.on('connection',(socket)=>{
    if(users.length === 2){
        socket.emit('full');
        return;
    }
    let user = {
        id: socket.id,
        name: 'Player '+(users.length+1),
        Symbol: users.length ===0 ?'X' : 'O',
        numbers: (users.length+1)
    }
    if(users.length<2){
        users.push(user);
    }
    socket.emit("setUser",user);
    if(users.length===2){
        io.emit("start",{
            users: users,
            turn: turn,
            board: board
        })
        // socket.emit('turn',turn);
        io.sockets.emit('turn',turn);
    }
    if(users.length ===0){
        turn = 'X';
        board = ['','','','','','','','',''];

    }
   
    console.log('A user connected');

   

    socket.on('move',(data)=>{
        board=data.board;
        turn=data.turn;
        io.emit('move',{
            board:board,
            turn:turn,
            i:data.i,
        });
        turn = turn ==='X'?'O':'X';
        io.sockets.emit('turn',turn);


        //check if the game is over
        let winner = '';
        
        for(let i=0;i<3;i++){
            if(board[i*3]===board[i*3+1] && board[i*3]===board[i*3+2] && board[i*3]!==''){
                winner=board[i*3];
            } // for row wise logic
            if(board[i] === board[i+3] && board[i]=== board[i+6] && board[i]!==''){
                winner=board[i];
            } // for col wise logic
        }
             if(board[0] === board[4] && board[0]===board[8] && board[0]!== ''){
            winner=board[0]
        }
        if(board[2] === board[4] && board[2]===board[6] && board[2]!== ''){
            winner=board[2]
        }
        console.log(winner);

        if(winner!==''){
            io.emit('winner',winner);
        }

        // check if the game is draw

        // let draw = true;
        // for (let i=0;i<9;i++){
        //      if(baord[i]===''){
        //         draw=false;
        //      }
        // }
        // if(draw){
        //     io.emit('winner','draw')
        // }


    });
    socket.on('disconnect',()=>{
        users = users.filter((user)=> user.id !== socket.id)
    })
});

app.get('/',(req,res)=>{
    res.send('<h1>Hello world </h1>')
});

server.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}/`); 
})