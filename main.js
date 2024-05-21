let user = null;
let users=[];
let turn='';
let board=[];

var socket = io('http://localhost:3000',[
    {
        transports : ['websocket']
    }
]);



socket.on('connect',function(){
    // console.log('connected');
    user=null;
    board=[];
    document.getElementById('message').innerHTML='Connected';
});

socket.on('full',()=>{
    document.getElementById('message').innerHTML="Server is full";
})

socket.on('setUser',function(data){
    user = data;
    console.log(user);
})

socket.on("start",(data)=>{
    users=data.users;
    turn = data.turn;
    board=data.board;
    renderBoard();

    document.getElementById('message').innerHTML=`You are ${user.name} and your symbol is '${user.Symbol}'`;
});

socket.on('turn',(data)=>{
    turn = data;
    document.getElementById('message').innerHTML=`Your symbol is ${user.Symbol} It's ${turn}'s turn`;
})



socket.on('move',(data)=>{
    board=data.board;
    turn=data.turn;
   renderBoard();
});

socket.on('winner',(data)=>{
    document.getElementById('message').innerHTML=` Winner is ${data}`;
})

socket.on('disconnect',function(){
    // console.log('disconnected');
    document.getElementById('message').innerHTML='Disconnected';
});

window.onload=()=>{
   
    renderBoard();

}

function renderBoard(){
    let boardDiv = document.getElementById('board');
    let boardHTML = '';
    for(let i=0;i<board.length;i++){
       
           boardHTML+=` <div onclick='handleClick(${i})' class="w-32 h-32 text-white text-3xl grid place-content-center border-2 cursor-pointer ${board[i]==='O'? 'bg-red-600' : board[i]==='X' ? 'bg-green-600':''}">${board[i]}</div>`

        
        }
       boardDiv.innerHTML=boardHTML;
}


function handleClick(i){
   
    console.log(`Clicked ${i}`);

    if(board[i]===''){
        // board[i]=user.Symbol;
        // socket.emit('move',{
        //     board:board,
        //     turn:turn,
        //     i:i,
        // });
        // renderBoard();
        if(turn === user.Symbol){
            board[i]=user.Symbol;
            socket.emit('move',{
                board:board,
                turn:turn,
                i:i,
            });
        }
    }

}

/*
user: This is an object that represents a single user. It contains properties such as id, name, Symbol, and numbers that provide information about that user. You create a new user object each time a connection is established.
users: This is an array that stores all the user objects. When a new user connects, their user object is added to the users array. When a user disconnects, their user object is removed from the users array.

*/