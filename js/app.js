/* jshint esversion: 6 */

// Array to hold selected cards
let selectedCards = [];
let comparingCards = false; //
class Card {
	constructor(image, matched, index) {
		this.image = image; // String
		this.matched = matched; // Boolean
		this.index = index;  // each pair of cards will have the same index# to compare for match
		this.shuffledIndex = 0;  // the shuffled position in the deck
	}
}

const images = ['crab.svg', 'dolphin.svg', 'fish.svg', 'lemonade.svg',
'palm-trees.svg', 'sailboat.svg', 'snorkel.svg', 'sun.svg'];
//function sCard(symbol: any, matched: any): void
/*
 * Create a list that holds all of your cards
 */
let cardList = [];

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
	if(comparingCards){
		// clear previously selected cards and return
		handleCardComparison();
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
		comparingCards = true; 
	}
}

function handleCardComparison(){
// If no match, hide card images, clear selected array
	if(!compareCards()){
		//TODO Need to wait for click
		console.log('compare false');
		console.log(selectedCards);
		selectedCards.forEach(function (card){
			//console.log(cardList);
			let cardToHide =  document.getElementById(card.shuffledIndex).getElementsByTagName('img')[0];
			cardToHide.classList.remove('show');
			cardToHide.classList.add('hide');
			//console.log(cardToHide);
			
		});
		selectedCards = [];
	} else {
		// keep images displayed, tag both cards as matched
	}
	comparingCards = false;
}

function compareCards(){
	console.log('comparing');
	if(selectedCards[0].index === selectedCards[1].index){
		console.log('Match');
		selectedCards[0].matched = selectedCards[1] = true;
		return true;
	} else {
		// No match
		return false;
	}
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
const deck = document.querySelector('.deck');
deck.addEventListener('click', cardClicked);