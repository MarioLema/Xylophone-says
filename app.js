//===========================================DATA OBJECT========================================================
const DATA = {
    lightColors: ["#ADD1D2","#FFE6DC","#fffbfe","#CDFFD0","#FF8276","#FFF073","#6A8091"],
    aiArray: [],
    playerArr: [],
    busy: false,
    timeGap: 600,
    playing: false

};

//===========================================VIEW METHODS========================================================
const VIEW = {

    //HIGHLIGHTS THE COLOR OF THE KEY PLAYED AND SETS IT BACK TO NORMAL AFTER X MILISECONDS
    highlight(keyId){
         lightColor = DATA.lightColors[keyId],
         element = document.getElementById(`key-${keyId}`),
         originalColor = element.style.fill;
        element.setAttribute(`style`, `fill: ${lightColor};`);
        setTimeout( () => {
        element.setAttribute(`style`, `fill: ${originalColor};`);
        }, 300);
    },

    //STOPS THE SOUNDS IF IT IS PLAYING AND PLAYS IT AGAIN
    playSound(keyId){
        let sound = document.getElementById(`sound-key-${keyId}`)
            sound.pause();
            sound.currentTime = 0;
        sound.play();
    },

    //PAUSES THE SOUND (FOR RESET)
    pauseSound(keyId){
        document.getElementById(`sound-key-${keyId}`).pause();
    },

    //DISPLAYS THE END MESSAGE
    displayEnd(winLose){
        let elem = document.getElementById(`endgame`);
        elem.setAttribute( `style`, `display: flex` );
        let message  = document.getElementById(`endgame-message`);
        message.innerHTML = winLose === `win` ? "YOU WIN!" : "YOU LOSE!";
    },

    //HIDES THE END MESSAGE (FOR ACCEPT BUTTON)
    hideEnd(){
        let elem = document.getElementById(`endgame`);
        elem.setAttribute( `style`, `display: none` );
    }

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    //STARTS THE GAME ON CLICK, RESETS DATA OBJECT AND PLAYS FIRST TUNE
    startGame(){
        this.resetGame();
        DATA.playing = true;
        setTimeout(() => {
            this.aiTurn();
        }, 500);
    },

    //RESETS THE DATA OF THE GAME
    resetGame(){
        DATA.aiArray = [];
        DATA.playerArr = [];
        DATA.busy = false;
        DATA.timeGap = 600;
        DATA.playing = false;
        for(let i = 0; i < 7; i++){
            VIEW.pauseSound(i);
        }
    },

    //PLAYS THE TUNE OF THE AIARRAY FOR THE PLAYER TO IMITATE
    aiTurn(){
        if(DATA.aiArray.length >= 8) { //if the array is bigger than x and player has not missed it declares a winner
            VIEW.displayEnd(`win`);
            VIEW.playSound(7);
            return;
        }
        DATA.busy = true;
        DATA.aiArray.push(Math.floor(Math.random() * 6)); //pushes a new key into the aiarray
        for(let i = 0; i < DATA.aiArray.length; i++){ //plays all the key after a variable time
            let time = setTimeout(() => {
                VIEW.highlight(DATA.aiArray[i]);
                VIEW.playSound(DATA.aiArray[i]);
            }, DATA.timeGap * i);

        }
        setTimeout(() => {DATA.busy = false}, DATA.timeGap * DATA.aiArray.length); //lets the player click keys after the last key has been played
    },

    //ACCEPTS PLAYERS CLICKS
    playerKeyDown(){
        let id = this.checkTarget(event);
        if(id && !DATA.busy){ //if the id is valid and there is no animation running
            DATA.busy = true;
            VIEW.highlight(id);
            VIEW.playSound(id);
            setTimeout(() => {  DATA.busy = false; }, 300);
            if(DATA.playing){ // runs only when the player is playing against the computer
                DATA.playerArr.push(Number(id));
                if (DATA.playerArr[DATA.playerArr.length - 1] !== DATA.aiArray[DATA.playerArr.length -1]){ //if the last index of playerarr is the same as the position of that index in aiarray
                    VIEW.displayEnd('lose');
                    VIEW.playSound(8)
                    this.resetGame();
                    return;
                }
                if(DATA.playerArr.length === DATA.aiArray.length){ //if it is the last index of the aiarray to be match
                    DATA.playerArr = [];
                    setTimeout(() => {  this.aiTurn(); }, 2000);
                }
            }




        }
    },

    //checks if the target of the click matches the classes of the key and its shadow
    checkTarget(event){
        if(event.target.classList.contains(`play-key`)){
            return event.target.id[event.target.id.length -1];
        }
        return false;
    }

}
MODIFIER.playerKeyDown = MODIFIER.playerKeyDown.bind(MODIFIER);
MODIFIER.startGame = MODIFIER.startGame.bind(MODIFIER);




//========================CLICK EVENTS============================================
document.getElementById(`xylophone-svg`).addEventListener(`click`, MODIFIER.playerKeyDown, false);
document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
document.getElementById(`accept-button`).addEventListener(`click`, VIEW.hideEnd, false);