// app.js

// Initialize decks array from localStorage or create an empty array
let decks = JSON.parse(localStorage.getItem('decks')) || [];

// Initialize selected deck index
let selectedDeckIndex = null;

// Initialize flashcards array from localStorage or create an empty array
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

// DOM Elements
const deckList = document.getElementById('deck-list');
const deckForm = document.getElementById('deck-form');
const flashcardList = document.getElementById('flashcard-list');
const flashcardForm = document.getElementById('flashcard-form');
const startQuizBtn = document.getElementById('start-quiz');
const resetBtn = document.getElementById('reset-btn'); // New: Reset button

// Display Decks
function displayDecks() {
    deckList.innerHTML = '';
    document.getElementById('deck-select').innerHTML = '<option value="" disabled selected>Select a deck</option>';
    decks.forEach((deck, index) => {
        const deckItem = document.createElement('div');
        deckItem.classList.add('deck-item');
        deckItem.textContent = deck.name;
        deckItem.addEventListener('click', () => selectDeck(index)); // Make sure index is passed correctly
        deckList.appendChild(deckItem);

        // Populate the deck dropdown menu
        const option = document.createElement('option');
        option.value = index;
        option.textContent = deck.name;
        document.getElementById('deck-select').appendChild(option);
    });

}

// Select Deck
function selectDeck(index) {
    if (index >= 0 && index < decks.length) {
        selectedDeckIndex = index;
    } else {
        selectedDeckIndex = null;
    }
    console.log('Selected Deck Index:', selectedDeckIndex);
    displayFlashcards();
}

// Display Flashcards
function displayFlashcards() {
    console.log('Displaying Flashcards');
    flashcardList.innerHTML = '';
    if (selectedDeckIndex !== null) {
        const selectedDeckId = decks[selectedDeckIndex].id;
        const deckFlashcards = flashcards.filter(card => card.deckId === selectedDeckId);
        deckFlashcards.forEach(card => {
            const flashcard = document.createElement('div');
            flashcard.classList.add('flashcard');
            flashcard.textContent = card.question;
            flashcard.addEventListener('click', () => flipCard(flashcard, card.answer));
            flashcardList.appendChild(flashcard);
        });
    }
}

// Reset Decks and Flashcards
function resetApp() {
    decks = []; // Clear decks array
    flashcards = []; // Clear flashcards array
    localStorage.removeItem('decks'); // Remove decks from localStorage
    localStorage.removeItem('flashcards'); // Remove flashcards from localStorage
    displayDecks(); // Update UI
}

// Create Deck
deckForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const deckName = deckForm['deck-name'].value;
    const deckId = Date.now().toString(); // Unique ID for each deck
    const newDeck = { id: deckId, name: deckName };
    decks.push(newDeck);
    localStorage.setItem('decks', JSON.stringify(decks));
    displayDecks();
    deckForm.reset();
});

// Add Flashcard
flashcardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = flashcardForm['question'].value;
    const answer = flashcardForm['answer'].value;
    const deckId = flashcardForm['deck-select'].value;
    const newFlashcard = { question, answer, deckId };
    flashcards.push(newFlashcard);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    displayFlashcards();
    flashcardForm.reset();
});

// Start Quiz
startQuizBtn.addEventListener('click', startQuiz);

// Reset Button Event Listener
resetBtn.addEventListener('click', resetApp);

// Initial Display
displayDecks();

// Quiz Logic
let quizMode = false;
let currentDeck = [];
let currentCardIndex = 0;
let correctAnswers = 0;

function startQuiz() {
    console.log('Starting Quiz');
    if (selectedDeckIndex !== null) {
        const selectedDeckId = decks[selectedDeckIndex].id;
        console.log('Selected Deck ID:', selectedDeckId);
        const deckFlashcards = flashcards.filter(card => card.deckId === selectedDeckId);
        console.log('Deck Flashcards:', deckFlashcards);
        console.log('Deck Flashcards Length:', deckFlashcards.length);
        if (deckFlashcards.length > 0) {
            console.log('Inside deckFlashcards.length > 0 block');
            quizMode = true;
            currentDeck = deckFlashcards;
            shuffleArray(currentDeck);
            currentCardIndex = 0; // Reset currentCardIndex to 0
            displayNextCard();
            document.getElementById('quiz-container').style.display = 'block';
        } else {
            alert('Please add flashcards to the selected deck to start the quiz.');
        }
    } else {
        alert('Please select a deck to start the quiz.');
    }
}

function displayNextCard() {
    if (currentCardIndex < currentDeck.length) {
        const card = currentDeck[currentCardIndex];
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.textContent = card.question;
        flashcard.addEventListener('click', () => flipCard(flashcard, card.answer));
        document.getElementById('quiz-container').innerHTML = '';
        document.getElementById('quiz-container').appendChild(flashcard);
    } else {
        endQuiz();
    }
}

function flipCard(card, answer) {
    if (!card.classList.contains('flipped')) {
        card.textContent = answer;
        card.classList.add('flipped');
        // Increment currentCardIndex when user flips card
        currentCardIndex++;
    } else {
        card.textContent = currentDeck[currentCardIndex].question;
        card.classList.remove('flipped');
    }
}

function endQuiz() {
    quizMode = false;
    document.getElementById('score').textContent = `Score: ${correctAnswers}/${flashcards.length}`;
    currentDeck = [];
    currentCardIndex = 0;
    document.getElementById('quiz-container').style.display = 'none';
    correctAnswers = 0;
}


// Shuffle Array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);
document.getElementById('end-quiz').addEventListener('click', endQuiz);