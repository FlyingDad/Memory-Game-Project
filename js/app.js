/* jshint esversion: 6 */

// Array to hold selected cards
const maxStars = 5;   // starting stars
const starReductionInitial = 2; // start reducing at this ,any turns
const starReductionCount = 2;  // reduce every two turns
let selectedCards = [];
let turnCounter = 0;
let turnDisplay = document.querySelector('.moves');
let restart = document.querySelector('.restart');
let cardList = [];
let startTime, endTime;
let starCount = maxStars;
const images = ['crab.svg', 'dolphin.svg', 'fish.svg', 'lemonade.svg',
'palm-trees.svg', 'sailboat.svg', 'snorkel.svg', 'sun.svg'];
const deck = document.querySelector('.deck');
restart.addEventListener('click', restartGame);

class Card {
	constructor(image, matched, index) {
		this.image = image; // String
		this.matched = matched; // Boolean
		this.index = index;  // each pair of cards will have the same index# to compare for match
		this.shuffledIndex = 0;  // the shuffled position in the deck
	}
}

//function sCard(symbol: any, matched: any): void
/*
 * Create a list that holds all of your cards
 */


// Add 8sets of two identical cards
// Index is used to compare cards for match
for(let i = 0; i < 8; i++){
	cardList.push(new Card(images[i], false, i));
	cardList.push(new Card(images[i], false, i));
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
	cardImage.forEach(function(img, index){
		img.setAttribute('src', 'img/' + cardList[index].image);
	});
	// let cards = document.querySelectorAll('.card');
	// cards.forEach(function (card, index){
	// 	card.setAttribute('id', index);
	// });
}

function cardClicked(event){
	
	//testing
	

	// Start game timer
	if (!startTime){
		startTime = Date.now();
	} else {
		endTime = Date.now();
	}

	let card = event.target;
	//console.log(card.nodeName);
	if(card.nodeName == 'LI'){
		//console.log('clicked a card');
		//console.log(card.getAttribute('id'));
		let cardIndex = card.getAttribute('id');
		//console.log(cardList[cardIndex]);
		displayCard(cardIndex);
	}
	//event.target.style.visibility = 'hidden';
}

function displayCard(cardIndex){
	//Check if card is already matched. Id so, return
	let card = cardList[cardIndex];
	if (card.matched) {
		return;
	}
	//Get image of card id that was clicked
	let cardToShow = document.getElementById(cardIndex).getElementsByTagName('img')[0];
	cardToShow.classList.remove('hide');
	cardToShow.classList.add('show');
	selectedCards.push(cardList[cardIndex]);
	//console.log('pushing ' + selectedCards);
	// If two cards in array, then compare them for a match, else return
	if(selectedCards.length == 2){
		updateMoveCount();
		handleCardComparison();
	}
}

function handleCardComparison(){
// If no match, hide card images, clear selected array
	if(!compareCards()){
		//TODO Need to wait for click
		//console.log('compare false');
		//console.log(selectedCards);
		setTimeout(hideSelectedCards, 300);		
	} else {
		selectedCards = [];
		if(checkForWin()){
			// Give DOM time to update and show last card clicked
			setTimeout(winGame, 500);
			//winGame();
		}
	}
}

function checkForWin(){
	let win = true;
	cardList.forEach(card => {
		if (card.matched == false){
			//console.log(card.matched);
			win = false;
		}
	});
	return win;
}

function hideSelectedCards(){
	//console.log('hiding cards');
	selectedCards.forEach(function (card){
		//console.log(cardList);
		let cardToHide =  document.getElementById(card.shuffledIndex).getElementsByTagName('img')[0];
		cardToHide.classList.remove('show');
		cardToHide.classList.add('hide');	
	});
	selectedCards = [];
}

function compareCards(){
	//console.log('comparing');
	if(selectedCards[0].index === selectedCards[1].index){
		//console.log('Match');
		selectedCards[0].matched = selectedCards[1].matched = true;
		return true;
	} else {
		// No match
		return false;
	}
}

function updateMoveCount(){
	turnCounter += 1;
	//console.log('Now: ' + startTime);
	let moveTxt = turnCounter == 1 ? ' Move' : ' Moves';
	turnDisplay.innerHTML = turnCounter + moveTxt;
	checkStars();
}

function winGame(){
	// stop game timer
	endTime = Date.now();
	let gameTime = getGameTime();
	// display win box
	let winbox = document.querySelector('.winner');
	winbox.classList.add('show-win');
	let winCount = document.querySelector('.win-count');
	winCount.innerHTML = turnCounter;
	let winTime = document.querySelector('.win-time');
	winTime.innerHTML = gameTime;
}

function restartGame(){
	console.log('restarting');
	turnCounter = 0;
	// Remove winbox if displayed
	let winbox = document.querySelector('.winner');
	winbox.classList.remove('show-win');
	// shuffle the deck
	//console.log(cardList);
	hideAllCards();
	//delay so card fade has time to fade, or you can see new cards briefly
	setTimeout(function() {
		shuffle(cardList);
		addImageToCards();
	},500);
	resetCards();
	resetStars();
	turnDisplay.innerHTML = 'No Moves';
	startTime = null;
}

function hideAllCards(){
	let cards = document.querySelectorAll('.card-image');
	cards.forEach(function(card){
		card.classList.remove('show');
		card.classList.add('hide');
	});
}

function resetCards(){
	cardList.forEach(function(card){
		card.matched = false;
	});
}

function getGameTime(){
	//console.log(endTime, typeof(endTime));
	let diff = endTime - startTime;
	// convert to seconds
	diff /= 1000;
	//console.log(endTime, startTime);
	//console.log('Gametime: ' + diff/1000);
	//let seconds = Math.floor(diff/1000);
	let minutes = Math.floor(diff/60);
	let seconds =  Math.floor(diff%60);
	console.log(minutes,seconds);
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
	} else if(turnCounter > starReductionInitial && turnCounter % starReductionCount == 0){
		removeStar();
		starCount --;
	}
}

function removeStar(){
	//let starList = document.querySelector('.stars');
	//let liToRemove = document.querySelector()
	//if(starList.childNodes[1]){
		//console.log(starList.childNodes[0]);
		//console.log(starList.childNodes[1]);
		//starList.removeChild(li);
	//}
	let star = document.querySelector(".star");
	if(star){
		star.remove();
	}
}

function resetStars(){
	let starList = document.querySelector('.stars');
	// remove any remaing stars
	while(starList.firstChild){
		starList.removeChild(starList.firstChild);
	}
	// create LI's and append to starlist
	let node = document.createElement("LI"); 
	let starHTML = '<i class="fa fa-star fa-2x"></i>';
	for(let i = 0; i < maxStars; i++){
		node.innerHTML += starHTML;
	}
	starList.appendChild(node);
	console.log(starList);
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

shuffle(cardList);
//console.log(cardList);
addImageToCards();
deck.addEventListener('click', cardClicked);