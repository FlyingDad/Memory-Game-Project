/* jshint esversion: 6 */

const maxStars = 3;   // starting stars
const starReductionInitial = 2; // start reducing at this ,any turns
const starReductionCount = 2;  // reduce every two turns
const images = ['crab.svg', 'dolphin.svg', 'fish.svg', 'lemonade.svg',
'palm-trees.svg', 'sailboat.svg', 'snorkel.svg', 'sun.svg'];
const deck = document.querySelector('.deck');

// Array to hold selected cards
let selectedCards = [];
let turnCounter = 0;
let turnDisplay = document.querySelector('.moves');
let restart = document.querySelector('.restart');
let playAgainBtn = document.querySelector('#play-again');
let winbox = document.querySelector('.winner');
let cardList = [];
let startTime, endTime;
let starCount = maxStars;
// used to disable click when showing cards to eliminate cheating
let comparing = false; 

restart.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

class Card {
	constructor(image, matched, index) {
		this.image = image; // String
		this.matched = matched; // Boolean
		this.index = index;  // each pair of cards will have the same index# to compare for match
		this.shuffledIndex = 0;  // the shuffled position in the deck
	}
}

// Add 8 sets of two identical cards
// Index is used to compare cards for match
for(let i = 0; i < 8; i++){
	cardList.push(new Card(images[i], false, i));
	cardList.push(new Card(images[i], false, i));
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	// Put shuffled position into card object so we can later hide image
	for (let i = 0; i < array.length; i++){
		array[i].shuffledIndex = i;
	}

	return array;
}

function addImageToCards(){
	let cardImage = document.querySelectorAll('.card-image');
	cardImage.forEach((img, index) => {
		img.setAttribute('src', 'img/' + cardList[index].image);
	});
}

function cardClicked(event){
	// Start game timer
	if (!startTime){
		startTime = Date.now();
	} else {
		endTime = Date.now();
	}
	// can only click new cards once comparison is done and cards dissapear
	if(!comparing){
		let card = event.target;
		if(card.nodeName == 'LI'){
			let cardIndex = card.getAttribute('id');
			displayCard(cardIndex);
		}
	}
}

function displayCard(cardIndex){
	//Check if card is already matched. Id so, return
	let card = cardList[cardIndex];
	if (card.matched) {
		return;
	}
	// Shake the card
	let selectedCard = document.getElementById(cardIndex);
	selectedCard.classList.add('card-show');
	//Get image of card id that was clicked
	let cardToShow = selectedCard.getElementsByTagName('img')[0];
	cardToShow.classList.remove('hide');
	cardToShow.classList.add('show');
	selectedCards.push(cardList[cardIndex]);
	// If two cards in array, then compare them for a match, else return
	if(selectedCards.length == 2){
		updateMoveCount();
		comparing = true;
		handleCardComparison();
	}
}

function handleCardComparison(){
// If no match, hide card images, clear selected array
	if(!compareCards()){
		setTimeout(hideSelectedCards, 1000);		
	} else {
		selectedCards = [];
		if(checkForWin()){
			// Give DOM time to update and show last card clicked
			setTimeout(winGame, 500);
		}
		comparing = false;
	}
}

function checkForWin(){
	let win = true;
	cardList.forEach(card => {
		if (card.matched == false){
			win = false;
		}
	});
	return win;
}

function hideSelectedCards(){
	selectedCards.forEach((card) => {
		let cardLi = document.getElementById(card.shuffledIndex);
		cardLi.classList.remove('card-show');
		let cardToHide =  cardLi.getElementsByTagName('img')[0];
		cardToHide.classList.remove('show');
		cardToHide.classList.add('hide');	
	});
	selectedCards = [];
	comparing = false;
}

function compareCards(){
	// Check for match
	if(selectedCards[0].index === selectedCards[1].index){
		selectedCards[0].matched = selectedCards[1].matched = true;
		return true;
	} else {
		// No match
		return false;
	}
}

function updateMoveCount(){
	turnCounter += 1;
	let moveTxt = turnCounter == 1 ? ' Move' : ' Moves';
	turnDisplay.innerHTML = turnCounter + moveTxt;
	checkStars();
}

function winGame(){
	// stop game timer
	endTime = Date.now();
	let gameTime = getGameTime();
	// display win box
	winbox.classList.add('show-win');
	let winCount = document.querySelector('.win-count');
	winCount.innerHTML = turnCounter;
	let winTime = document.querySelector('.win-time');
	winTime.innerHTML = gameTime;
	let starRating = document.querySelector('.star-rating');
	starRating.innerHTML = starCount < 0 ?  0 : starCount;
}

function restartGame(){
	turnCounter = 0;
	// Remove winbox if displayed
	let winbox = document.querySelector('.winner');
	winbox.classList.remove('show-win');
	hideAllCards();
	//delay so card fade has time to fade, or you can see new cards briefly
	setTimeout(() => {
		shuffle(cardList);
		addImageToCards();
	},500);
	resetCards();
	turnDisplay.innerHTML = 'No Moves';
	startTime = null;
	starCount = maxStars;
	resetStars();
	winbox.classList.remove('show-win');
	comparing = false;
}

function hideAllCards(){
	let cards = document.querySelectorAll('.card-image');
	cards.forEach(card => {
		card.classList.remove('show');
		card.classList.add('hide');
	});
}

function resetCards(){
	cardList.forEach(card => {
		card.matched = false;
	});
}

function getGameTime(){
	let diff = endTime - startTime;
	// convert to seconds
	diff /= 1000;
	let minutes = Math.floor(diff/60);
	let seconds =  Math.floor(diff%60);
	if(minutes == 0){
		return `${seconds.toString()} seconds`;
		//return seconds.toString() + ' seconds';
	} else if (minutes == 1) {
		return `1 minute, ${seconds} seconds`;
		//return '1 minute, ' + seconds.toString() + ' ' + seconds;
	} else {
		return `${minutes} minutes, ${seconds} seconds`;
	}
}

function checkStars(){
	if(turnCounter == starReductionInitial){
		removeStar();
		starCount --;
	} else if(turnCounter > starReductionInitial && turnCounter % starReductionCount == 0 && starCount > 1){
		removeStar();
		starCount --;
	}
}

function removeStar(){
	let starToRemove = document.querySelectorAll("li")[starCount-1];
	if(starToRemove){
		starToRemove.classList.remove('star-on');
		starToRemove.classList.add('star-off');
	}
}

function resetStars(){
	let allStars = document.querySelectorAll("li");
	allStars.forEach((star) => {
		star.classList.remove('star-off');
		star.classList.add('star-on');
	});
}

// Main
shuffle(cardList);
addImageToCards();
deck.addEventListener('click', cardClicked);