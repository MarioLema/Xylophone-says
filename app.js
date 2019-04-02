//===========================================DATA OBJECT========================================================
const DATA = {
    lightColors: ["#ADD1D2","#FFE6DC","#fffbfe","#CDFFD0","#FF8276","#FFF073","#6A8091"],
    aiArray: [4,6,5,0,1],
    playerArr: [],
    busy: false,
    timeGap: 600,
    playing: false

};

//===========================================VIEW METHODS========================================================
const VIEW = {

    highlight(keyId){

         lightColor = DATA.lightColors[keyId],
         element = document.getElementById(`key-${keyId}`),
         originalColor = element.style.fill;
        element.setAttribute(`style`, `fill: ${lightColor};`);
        setTimeout( () => {
        element.setAttribute(`style`, `fill: ${originalColor};`);
        }, 300);
    },

    playSound(keyId){
        let sound = document.getElementById(`sound-key-${keyId}`)
            sound.pause();
            sound.currentTime = 0;
        sound.play();
    },

    pauseSound(keyId){
        document.getElementById(`sound-key-${keyId}`).pause();
    },
    displayEnd(winLose){
        let elem = document.getElementById(`endgame`);
        elem.setAttribute( `style`, `display: flex` );
        let message  = document.getElementById(`endgame-message`);
        message.innerHTML = winLose === `win` ? "YOU WIN!" : "YOU LOSE!";
    },
    hideEnd(){
        let elem = document.getElementById(`endgame`);
        elem.setAttribute( `style`, `display: none` );
    }

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    startGame(){
        this.resetGame();
        DATA.playing = true;
        setTimeout(() => {
            this.aiTurn();
        }, 500);


    },
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
    aiTurn(){
        if(DATA.aiArray.length >= 8) {
            VIEW.displayEnd(`win`);
            VIEW.playSound(7);
            return;
        }
        DATA.busy = true;
        DATA.aiArray.push(Math.floor(Math.random() * 6));
        for(let i = 0; i < DATA.aiArray.length; i++){
            let time = setTimeout(() => {
                VIEW.highlight(DATA.aiArray[i]);
                VIEW.playSound(DATA.aiArray[i]);
            }, DATA.timeGap * i);

        }
        setTimeout(() => {DATA.busy = false}, DATA.timeGap * DATA.aiArray.length);
    },


    playerKeyDown(){
        let id = this.checkTarget(event);
        if(id && !DATA.busy){
            DATA.busy = true;
            VIEW.highlight(id);
            VIEW.playSound(id);
            setTimeout(() => {  DATA.busy = false; }, 300);
            if(DATA.playing){
                DATA.playerArr.push(Number(id));
                if (DATA.playerArr[DATA.playerArr.length - 1] !== DATA.aiArray[DATA.playerArr.length -1]){
                    VIEW.displayEnd('lose');
                    VIEW.playSound(8)
                    this.resetGame();
                    return;
                }
                if(DATA.playerArr.length === DATA.aiArray.length){
                    DATA.playerArr = [];
                    setTimeout(() => {  this.aiTurn(); }, 2000);
                }
            }




        }
    },

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
// document.getElementById(`memory-game`).addEventListener(`click`, MODIFIER.turn, false);
// document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
// document.getElementById(`reset-game`).addEventListener(`click`, MODIFIER.resetGame, false);
// MODIFIER.winkUpListener(document.querySelectorAll(`.card-front`));