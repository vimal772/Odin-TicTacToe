const start = document.querySelector('.start');
const reStart = document.querySelector('.reStart');

start.addEventListener('click',()=> {
    const player1 = document.querySelector('.playerOne').value;
    const player2 = document.querySelector('.playerTwo').value;

    const game = gameController(player1,player2);
    game.createBoard();
    let buttons = document.querySelectorAll('.cell');
    buttons.forEach((btn)=>{
        btn.addEventListener('click',()=> {
            if(btnHasText()){
                btn.innerText = game.getActivePlayer().sign;
                game.switchPlayerTurn();
                game.checkLogic();
            }else {
                return;
            }
            function btnHasText() {
                return btn.innerText === "";
            }
        })
    })
});


reStart.addEventListener('click',()=> {
        const game = gameController("","");
        game.newRound();
        // game.defaultPlayer();
});

function gameController(playerOne = "Player One",playerTwo = "Player Two",sign1 = "X",sign2 = "O") {
    const { createBoard,reStart } =  gameBoard();
    const players = [
        {
            name: playerOne,
            token: 1,
            sign : sign1
        },
        {
            name : playerTwo,
            token : 2,
            sign : sign2
        }
    ] 

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
       activePlayer = activePlayer === players[0] ? players[1]: players[0];
    }

    const getActivePlayer = () => activePlayer;

    // const defaultPlayer = () => {
    //     activePlayer = players[0];
    // }

    function newRound() {
        document.querySelectorAll('.cell').forEach((btn)=> {
            btn.textContent = "";
        })
    }

    const { checkLogic,appendMsg } = gameLogic();    
    return { switchPlayerTurn,createBoard,getActivePlayer,reStart,newRound,checkLogic,appendMsg }

};

function gameBoard(){
    const cells = 9;

    function createBoard(){
        for(let i=0;i<cells;i++){
            render(i);
        }
    }
    
    const div = document.querySelector('#gamePanel');
    
    function render(index) {
        const btn = document.createElement('button');
        btn.classList.add('cell');
        btn.classList.add(`cell-${index}`);
        div.appendChild(btn);  
    }

    function reStart() {
        document.querySelectorAll('.cell').forEach((btn) => {
            div.removeChild(btn);
        });
    } 

    return { createBoard,reStart };
}


function gameLogic() {
    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];
    let isGameWon = false;
    function checkLogic() {
        if(isGameWon){ return };
        const buttons = document.querySelectorAll('.cell');
        for (const combo of winningCombos) {
            let [a,b,c] = combo;
            if(buttons[a].innerText && (buttons[a].innerText == buttons[b].innerText) && (buttons[a].innerText == buttons[c].innerText)) {
                appendMsg();
                isGameWon = true;
            }
        }
    }

    function appendMsg() {
        const div = document.querySelector('.displayMsg');
        const para = document.createElement('p');

        para.textContent = "Player has won";
        div.appendChild(para);
    }

    return { checkLogic,appendMsg };
}