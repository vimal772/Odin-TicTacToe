const start = document.querySelector('.start');
const reStart = document.querySelector('.reStart');
const closeBtn = document.querySelector('.close');

start.addEventListener('click', () => {
    Game.start();
})

reStart.addEventListener('click',()=> {
    Game.gameRestart();
});

closeBtn.addEventListener('click',()=> {
    Game.reStart();
})
const gameBoard = (() => {
    const cells = 9;

    function createBoard(){
        for(let i=0;i<cells;i++){
            render(i);
        }
    }
    
    const div = document.querySelector('#gamePanel');
    
    function render(index) {
        const select = document.querySelector('#playerSelect').value;
        if(select == 'player'){
            const btn = document.createElement('button');
            btn.classList.add('cell');
            btn.setAttribute('id',`cell-${index}`);
            div.appendChild(btn);
        
        //hover
            let buttons = document.querySelectorAll('.cell');
                buttons.forEach((btn)=>{
                    btn.addEventListener('click', Game.handleClick);
            })
        }else if(select == 'minmaxbot'){
            const btn = document.createElement('button');
            btn.classList.add('cell');
            btn.setAttribute('id',`cell-${index}`);
            div.appendChild(btn);
        
        //hover
            let buttons = document.querySelectorAll('.cell');
                buttons.forEach((btn)=>{
                    btn.addEventListener('click', Game.minmaxbot);
            })
        }
        else{
            const btn = document.createElement('button');
            btn.classList.add('cell');
            btn.setAttribute('id',`cell-${index}`);
            div.appendChild(btn);
        
        //hover
            let buttons = document.querySelectorAll('.cell');
                buttons.forEach((btn)=>{
                    btn.addEventListener('click', Game.botClick);
            })
        }
        
    } 

    return { 
        createBoard,
    };
})();
    

const Game = (() => {
    let players = [];
    let currentPlayer;
    let gameOver = false;
    let spaces = ["","","","","","","","",""];
    let called = false;
    players = [
        createPlayer('Player One', "X"),
        createPlayer('Player Two',"O"),
    ]
    const start = () => {
        if(called){ return };
        currentPlayer = 0;
        gameOver = false;
        gameBoard.createBoard()
        called = true;
    }

    const displayScore = (sign) => {
        const para1 = document.querySelector('.X_score');
        const para2 = document.querySelector('.O_score');
        const div = document.querySelector(`.container${sign}`);

        if(sign == "X"){
            para1.textContent = (parseInt(para1.textContent)+1).toString();
            div.appendChild(para1)
        }else if(sign == 'O'){
            para2.textContent = (parseInt(para2.textContent)+1).toString();
            div.appendChild(para2)
        }else{
            return;
        }

        if(para1.textContent >= 5 || para2.textContent >=5 ){
            para1.textContent = 0;
            para2.textContent = 0;
            Game.gameRestart();
        }

    }

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === 0 ? 1:0; 
    }

    function handleClick(event) {
        if(gameOver) {return}
        let indexArr = event.target.id.split('-')[1];

        let index= event.target.id;
        if(btnHasText()){
            document.querySelector(`#${index}`).classList.add('active')
            document.querySelector(`#${index}`).textContent = players[currentPlayer].mark;
            spaces[indexArr] = players[currentPlayer].mark;
            checkWinner();
            switchPlayerTurn();
        }else {
            return;
        }
        function btnHasText() {
            return event.target.innerText === "";
        }
    }

    function botClick(event) {
        if(gameOver) {return}
        let indexArr = event.target.id.split('-')[1];

        let index= event.target.id;
        if(btnHasText()){
            document.querySelector(`#${index}`).classList.add('active')
            document.querySelector(`#${index}`).textContent = players[currentPlayer].mark;
            spaces[indexArr] = players[currentPlayer].mark;
            randomAddValue();
            checkWinner();
            // switchPlayerTurn();
        }else {
            return;
        }
        function btnHasText() {
            return event.target.innerText === "";
        }

        function randomAddValue() {
            if(spaces.length == 0){
                return;
            }

            const randomNumber = Math.floor(Math.random() * spaces.length -1);
            if(spaces[randomNumber] == "X"){
                randomAddValue();
            }else{
                spaces[randomNumber] == "O";
                document.querySelector(`#cell-${randomNumber}`).textContent = "O"; 
            }
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
                    appendMsg();
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
                appendMsg("TIE");
                gameOver = true;
            }
        }

        checkWinnerCombo();
        chechForTie();
    }

    function appendMsg(msg=`${players[currentPlayer].mark} Has Won`) {
        const div = document.querySelector('.displayMsg');
        const para = document.querySelector('.para');
        
        para.textContent = `${msg}`
        div.appendChild(para);
        div.showModal();

        if(msg === "TIE"){
            return;
        }else if(msg === "X Has Won"){
            displayScore(players[currentPlayer].mark)
        }else{
            displayScore(players[currentPlayer].mark)
        }

        setTimeout(
            closeDiv,
            2500
        );

        function closeDiv() {
            div.close();
            gameRestart();
        } 
    }

    function gameRestart(){
        currentPlayer = 0;
        gameOver = false
        spaces.fill("");
        document.querySelectorAll(`.cell`).forEach((cell) => {
            cell.classList.remove('active');
            cell.textContent = "";
        })
    }

    
    function reStart() {
        const para1 = document.querySelector('.X_score');
        const para2 = document.querySelector('.O_score');
        const div = document.querySelector('#gamePanel')
        spaces.fill("");
        gameOver = false;
        called = false;
        para1.textContent = 0;
        para2.textContent = 0;
        currentPlayer = 0;
        document.querySelectorAll('.cell').forEach((btn) => {
            div.removeChild(btn);
        });
    }

    function minmaxbot() {
        
    }


    return {
        start,
        handleClick,
        botClick,
        minmaxbot,
        gameRestart,
        reStart,
    }
})()

function createPlayer(name,mark){
    return {
        name,
        mark
    }
}