/*  
    - Soit une grille de x ligne y colonne composée de carré de couleur aléatoire
    - et un bouton par couleur possible
    - quand on clique sur un bouton on transmet la couleur du bouton au carré qui est en haut à gauche
    - les carrés qui se trouvent à gauche, en haut, à droite, en bas s'il sont de la couleur d'origine du carré de référence 
        changent aussi de couleur
    - on propage l'opération
    - Si tous les carrés sont de la même couleur c'est gagné


    Les variables sont anglais et les commentaires en français pour l'instant
*/

let amountOfTimes = 0;
let listButtons;
let listDivMaree;
let amountLines = 20;
let amountColumns = 20;

const COLORS = [
    'firstColor', 
    'secondColor',
    'thirdColor',
    'fourthColor'
];

const BUTTONLAUNCHGAME = document.querySelector('.buttonLaunchGame');
const DIVEXPLANATIONS = document.getElementsByClassName('divExplanations')[0];

// Variables for the timer
let startingMinutes;
let time;
let myTimer;
const COUNTDOWN = document.querySelector('.timer');
COUNTDOWN.innerHTML = `01:00`;
// Variables nombre de coups

const DIV_MOVES = document.querySelector(".spanMoves");


// Variables for the modal appearing at the end of the round
const MODAL = document.getElementsByClassName("modal")[0];

// Get the <span> element that closes the modal
const SPAN_CLOSE = document.getElementsByClassName("close")[0];

const DIVNO = document.getElementsByClassName("modalNo")[0];

// When the user clicks on <span> (x), close the modal
SPAN_CLOSE.onclick = function() {
    MODAL.style.display = "none";
}

// When the user clicks on the button "Non" in the modal, close the modal
DIVNO.onclick = function() {
    MODAL.style.display = "none";
  }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == MODAL) {
    MODAL.style.display = "none";
  }
}

//  Variables to shake the game

const BODY = document.querySelector("body");
const MAREE = document.querySelector(".maree");
let rotation = 1;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonctions //////////////////////////
////////////////////////////

/**
 * Fonctions appelée au click sur un bouton qui lance la marée, teste la victoire et compte les coups
 * fonction impure
 * @param {string} color 
 */
function play(color) {

    let firstDiv = getDiv(0,0);

    changeColor(firstDiv.getAttribute('data-color'), color, firstDiv);

    amountOfTimes++;
    displayAmountMoves(amountOfTimes);

    if(amountOfTimes%5 === 0 && amountOfTimes>=5){
        console.log("dans la condition to shake");
        shakeTheGame();
    }

    for(let color of COLORS){

        if(isWin(listDivMaree, color)){
            showMessage(amountOfTimes, true);
            
        }
    }

    
}

function shakeTheGame(){
    console.log("dans la fonction to shake");

    let degrees = rotation*90;
    rotation++;

    console.log("degrees", degrees)

    BODY.style.animation="vibrate-3 1s linear forwards";
    BODY.style.overflow="hidden";
    MAREE.style.transform=`rotate(${degrees}deg)`;
    setTimeout(function(){
        BODY.style.animation="";
    }, 2000);


}

/**
 * Fonctions pour montrer le nombre de coups joués

 * @param {number} moves 
 */

function displayAmountMoves(moves){

    DIV_MOVES.innerHTML = moves

}


/**
 * Fonction pour faire apparaitre un message en fin de partie et le choix de recommencer
 * fonction impure
 * @param {number} amountOfTimes nombre de fois que la personne a cliqué
 * @param {boolean} isWon a-t'il gagné?
 */

function showMessage(amountOfTimes, isWon){

    MODAL.style.display = "block";

    if(isWon){
        document.querySelector(".textModal").innerHTML = `Vous avez gagné en ${amountOfTimes} coups! \n Voulez-vous recommencer?`; 
        window.clearInterval(myTimer);
        COUNTDOWN.innerHTML = `Gagné!`;

    }
    else{
        document.querySelector(".textModal").innerHTML = `Vous avez perdu! Voulez-vous recommencer?`; 

    }


    let divYes = document.getElementsByClassName("modalYes")[0];
    let divNo = document.getElementsByClassName("modalNo")[0];

    divYes.onclick = function() {
        MODAL.style.display = "none";
        resetTimer();
        restartTheGame();
    }

    divNo.onclick = function() {
        MODAL.style.display = "none";
        window.clearInterval(myTimer);
        COUNTDOWN.innerHTML = `01:00`;
    }

}


/** 
* fonctions générant les divs dans l'HTML sur base du nombre de lignes et de colonnes passées en paramètres
* ces div ont une couleur aléatoire tirées dans le tableaux des couleurs possibles
* @param {string[]} tabcolors le tableau des couleurs acceptables
* @param {number} lines le nombre de ligne
* @param {number} columns le nombre de colonnes
* @param {HTMLDivElement} divParent le div où on l'on place les divs générés
*/
function generateMaree (tabColors, lines, columns, divParent){
    arrayColors = tabColors;
    divBackground = document.querySelector(`.${divParent}`);

    for(let i = 0; i<lines; i++){
        for(let j=0; j<columns; j++){
            randomNumber = Math.floor(Math.random() * 4);
            randomColor = arrayColors[randomNumber];
            let newDiv = document.createElement("div");
            newDiv.classList.add("divOneColor");
            newDiv.classList.add(randomColor);
            newDiv.setAttribute("data-ligne", i);
            newDiv.setAttribute("data-colonne", j);
            newDiv.setAttribute("data-color", randomColor);
            document.querySelector(".maree").appendChild(newDiv); 
        }
    }
    return document.querySelectorAll(".divOneColor");
}

/**
 * Fonction générant les boutons de choix de couleurs sur base d'un tableau des couleurs possibles
 * Les boutons générés écoutent l'évènement click
 * @param {string[]} tabColors 
 */
function generateButtons(tabColors){

    arrayColors = [...tabColors];

    for(let color of arrayColors){
        let newDiv = document.createElement("div");
        newDiv.classList.add("buttonOneColor");
        newDiv.classList.add(color);
        newDiv.setAttribute("data-color", color);
        document.querySelector(".buttons").appendChild(newDiv); 
    }

}

/**
 * Fonction permettant de changer la couleur d'un div passé en paramètre si celui-ci possède la couleur de oldColor 
 * La fonction s'assurera aussi d'exécuter la même fonction sur les div haut, bas, gauche, droite s'ils existent
 * @param {string} oldColor ancienne couleur
 * @param {string} newColor nouvelle couleur
 * @param {HTMLDivElement} div le div qui doit changer de couleur
 */
function changeColor(oldColor, newColor, div){

    setCouleur(div, newColor);

    let divsAround = [getHaut(div), getBas(div), getGauche(div), getDroite(div)]

    for(let divAround of divsAround){
        if(divAround){
            let colorSquare = divAround.getAttribute('data-color');

            if(colorSquare === oldColor && colorSquare !== newColor){


                changeColor(oldColor, newColor, divAround);
            }
        }
    }
    
}

/**
 * fonction renvoyant le div du dessus s'il existe
 * @param {HTMLDivElement} div 
 * @returns {HTMLDivElement | null} le div du dessus ou null
 */

function getHaut(div) {
    keyLine = Number(div.getAttribute("data-ligne"));
    keyColumn = Number(div.getAttribute("data-colonne"));


    if(keyLine === 0){
        answer = null;
    }
    else{
        answer = getDiv(keyLine-1, keyColumn);
    }
    return answer;
}

/**
 * fonction renvoyant le div du dessous s'il existe
 * @param {HTMLDivElement} div 
 * @returns {HTMLDivElement | null} le div du dessous ou null
 */

function getBas(div) {
    keyLine = Number(div.getAttribute("data-ligne"));
    keyColumn = Number(div.getAttribute("data-colonne"));


    if(keyLine === amountLines-1){

        answer = null;
    }
    else{
        answer = getDiv(keyLine+1, keyColumn);
    }

    return answer
}

/**
 * fonction renvoyant le div à gauche s'il existe
 * @param {HTMLDivElement} div 
 * @returns {HTMLDivElement | null} le div à gauche ou null
 */

function getGauche(div) {
    keyLine = Number(div.getAttribute("data-ligne"));
    keyColumn = Number(div.getAttribute("data-colonne"));


    if(keyColumn === 0){
        answer = null;
    }
    else{
        answer = getDiv(keyLine, keyColumn-1);
    }
    return answer;
}

/**
 * fonction renvoyant le div à droite s'il existe
 * @param {HTMLDivElement} div 
 * @returns {HTMLDivElement | null} le div à droite ou null
 */

function getDroite(div) {
    keyLine = Number(div.getAttribute("data-ligne"));
    keyColumn = Number(div.getAttribute("data-colonne"));


    if(keyColumn === amountColumns-1){
        answer = null;
    }
    else{
        answer = getDiv(keyLine, keyColumn+1);
    }
    return answer;
}

/**
 * fonction renvoyant le div sur base de sa position ligne/colonne s'il existe
 * @param {number} ligne le numéro de ligne
 * @param {number} colonne le numéro de colonne
 * @returns {HTMLDivElement | null} le div ou null
 */

function getDiv(ligne, colonne) {

    if(document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne}"]`)){
        return document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne}"]`)
    }
    else{
        return null;
    }
}

/**
 * Fonction modifiant la couleur d'un div passé en paramètre
 * @param {DivHTMLElement} div 
 * @param {string} couleur 
 */

function setCouleur(div, couleur) {

    for(color of COLORS){

        div.classList.remove(color);

    }

    div.classList.add(couleur);

    div.setAttribute("data-color", couleur);


}

/**
 * Fonction testant si tous les divs sont de la couleur passée en paramètre 
 * @param {DivHTMLElement[]} divs le tableau de tous les divs 
 * @param {string} couleur 
 * @returns {boolean}
 */

function isWin(divs, color){

    for(let div of divs){
        if(div.getAttribute("data-color") !== color){
            return false;
        }
        
    }
    return true;
}

/**
 * Fonction pour recommencer la partie
 */

function restartTheGame(){

    amountOfTimes = 0;
    startingMinutes = 1;
    displayAmountMoves(amountOfTimes);

    MAREE.style.transform='';

    for(div of listDivMaree){
        div.remove();
    }

    listDivMaree = generateMaree(COLORS, amountLines, amountColumns, "maree");


}

/**
 * Fonction updateCountDown pour mettre à jour le timer sur la page
 */

function updateCountDown(){
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    if(minutes == 1){
        console.log("minutes === 1")
        COUNTDOWN.innerHTML = `01:00`;
    }
    else{
        minutes = "00"
        COUNTDOWN.innerHTML = `${minutes}:${seconds}`;
    }

    time--;

    if(time < 0){
        time = 0;
        showMessage(0, false);
    }

}

/**
 * Fonction startTimer pour que le timer commence
 */


function startTimer(){
    startingMinutes = 1;
    time = startingMinutes * 60;
    myTimer = setInterval(updateCountDown, 1000);
}

/**
 * Fonction resetTimer pour remettre à zéro le timer
 */


function resetTimer(){
    window.clearInterval(myTimer);
    startingMinutes = 1;
    time = startingMinutes * 60;
    myTimer = setInterval(updateCountDown, 1000);

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************
 ************************** Le jeu commence ici
 */

BUTTONLAUNCHGAME.addEventListener("click", function() {

    BUTTONLAUNCHGAME.classList.add("buttonLaunchGameAway");
    console.log(DIVEXPLANATIONS)
    DIVEXPLANATIONS.style.display = "none";

    startTimer();

    for(let button of listButtons){
        button.style.pointerEvents = "auto";
    }
})

generateButtons(COLORS);



listDivMaree = generateMaree(COLORS, amountLines, amountColumns, "maree");

listButtons = document.querySelectorAll(".buttonOneColor");

for(let button of listButtons){
    button.addEventListener("click", function() {
        color = button.getAttribute("data-color");

        play(color);
    })
}