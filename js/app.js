/* jshint esversion: 6 */

class Card {
	constructor(image, matched, index) {
		this.image = image; // String
		this.matched = matched; // Boolean
		this.index = index;
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

	return array;
}

function addImageToCards(){
	let cardImage = document.querySelectorAll('.card-image');
	cardImage.forEach(function(img, index){
		img.setAttribute('src', 'img/' + cardList[index].image);
	});
	let cards = document.querySelectorAll('.card');
	cards.forEach(function (card, index){
		card.setAttribute('id', index);
	});
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
addImageToCards();
const deck = document.querySelector('.deck');
//console.log(deck);
deck.addEventListener('click', function (event){
	let card = event.target;
	//console.log(card.nodeName);
	if(card.nodeName == 'LI'){
		console.log('clicked a card');
		console.log(card.getAttribute('id'));
		let cardID = card.getAttribute('id');
		console.log(cardList[cardID]);
	}
	//event.target.style.visibility = 'hidden';
});