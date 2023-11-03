const start = document.querySelector('.start');
const reStart = document.querySelector('.reStart');
//     function appendMsg() {
//         const div = document.querySelector('.displayMsg');
//         const para = document.createElement('p');

//         para.textContent = "Player has won";
//         div.appendChild(para);
//     }

start.addEventListener('click', () => {
    Game.start();
})

reStart.addEventListener('click',()=> {
    Game.gameRestart();
});

const gameBoard = (() => {
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
        btn.setAttribute('id',`cell-${index}`);
        div.appendChild(btn);
        
        
        //hover
        let buttons = document.querySelectorAll('.cell');
            buttons.forEach((btn)=>{
                btn.addEventListener('click', Game.handleClick );
            })
    }

    function reStart() {
        document.querySelectorAll('.cell').forEach((btn) => {
            div.removeChild(btn);
        });
    } 

    return { 
        createBoard,
        reStart,
    };
})();
    

const Game = (() => {
    let players = [];
    let currentPlayer;
    let gameOver = false;
    let spaces = ["","","","","","","","",""];
    const start = () => {
        players = [
            createPlayer(document.querySelector('.playerOne').value, "X"),
            createPlayer(document.querySelector('.playerTwo').value, 'O'),
        ]
        currentPlayer = 0;
        gameOver = false;
        gameBoard.createBoard()
    }

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === 0 ? 1:0; 
    }

    function handleClick(event) {
        if(gameOver) {return}
        let indexArr = event.target.id.split('-')[1];
        // console.log(index);

        let index= event.target.id;
        if(btnHasText()){
            document.querySelector(`#${index}`).textContent = players[currentPlayer].mark;
            spaces[indexArr] = players[currentPlayer].mark;
            switchPlayerTurn();
            checkWinner();
        }else {
            return;
        }
        function btnHasText() {
            return event.target.innerText === "";
        }
    }
    function checkWinner(){
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

        function checkWinnerCombo() {
            if(gameOver){ return };
            for (const combo of winningCombos) {
                let [a,b,c] = combo;
                if(spaces[a] && (spaces[a] == spaces[b]) && (spaces[a] == spaces[c])) {
                    // appendMsg();
                    console.log('win');
                    gameOver = true;
                }
            }
        }

        function chechForTie(){
            if(gameOver){ return }
            let cellsFull = spaces.every((space)=> {
                return space !== "";
            })

            if(cellsFull){
                console.log("Tie");
                setTimeout(
                    gameRestart,
                    5000
                );
            }
        }

        checkWinnerCombo();
        chechForTie();
    }

    function gameRestart(){
        spaces.fill("");
        document.querySelectorAll(`.cell`).forEach((cell) => {
            cell.textContent = "";
        })
    }

    return {
        start,
        handleClick,
        gameRestart,
    }
})()

function createPlayer(name,mark){
    return {
        name,
        mark
    }
}