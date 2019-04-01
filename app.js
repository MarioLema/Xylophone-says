//===========================================DATA OBJECT========================================================
const DATA = {
    lightColors: ["#ADD1D2","#FFE6DC","#fffbfe","#CDFFD0","#FF8276","#FFF073","#6A8091"], 
    busy: false,

};

//===========================================VIEW METHODS========================================================
const VIEW = {

    startGame(){

    },

    highlight(keyId){

         lightColor = DATA.lightColors[keyId],
         element = document.getElementById(`key-${keyId}`),
         originalColor = element.style.fill;
        element.setAttribute(`style`, `fill: ${lightColor};`);
        setTimeout( () => {
        element.setAttribute(`style`, `fill: ${originalColor};`);
        }, 200);
    },

    playSound(keyId){
        let sound = document.getElementById(`sound-key-${keyId}`)
        if(!sound.paused){
            sound.pause();
            sound.currentTime = 0;
        }
        sound.play();
    }

};

//===========================================MODIFIER METHODS========================================================
const MODIFIER = {

    playerKeyDown(){
        let id = this.checkTarget(event);
        if(id && !DATA.busy){
            DATA.busy = true;
            VIEW.highlight(id);
            VIEW.playSound(id);
            setTimeout(() => {
                DATA.busy = false;
            }, 200);





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




//========================CLICK EVENTS============================================
document.getElementById(`xylophone-svg`).addEventListener(`click`, MODIFIER.playerKeyDown, false);
// document.getElementById(`memory-game`).addEventListener(`click`, MODIFIER.turn, false);
// document.getElementById(`start-game`).addEventListener(`click`, MODIFIER.startGame, false);
// document.getElementById(`reset-game`).addEventListener(`click`, MODIFIER.resetGame, false);
// MODIFIER.winkUpListener(document.querySelectorAll(`.card-front`));