// Icons as SVG strings
const ICONS = {
    ghost: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19 8.963 24.5 12 24.5s5.5-2.463 5.5-5.5z"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    music: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3 4 6 1 7 4 8 5 11 6 8 9 7 6 6 5 3"/></svg>`
};

const ICON_KEYS = Object.keys(ICONS).filter(k => k !== 'sparkles');

// Game State
let cards = [];
let flippedCards = []; // Stores IDs
let moves = 0;
let timer = 0;
let isActive = false;
let isProcessing = false;
let gameWon = false;
let timerInterval;

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');
const finalTimeDisplay = document.getElementById('final-time');

// Initialize
function init() {
    startNewGame();
    restartBtn.addEventListener('click', startNewGame);
    playAgainBtn.addEventListener('click', startNewGame);
}

function startNewGame() {
    // Reset State
    moves = 0;
    timer = 0;
    isActive = true;
    isProcessing = false;
    gameWon = false;
    flippedCards = [];
    
    // Clear Timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Reset UI
    movesDisplay.textContent = moves;
    timerDisplay.textContent = formatTime(timer);
    winModal.classList.add('hidden');
    gameGrid.innerHTML = '';
    
    // Generate Cards
    const pairs = [...ICON_KEYS, ...ICON_KEYS];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    
    cards = shuffled.map((icon, index) => ({
        id: index,
        icon: icon,
        isFlipped: false,
        isMatched: false
    }));
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gameGrid.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const container = document.createElement('div');
    container.className = 'card-container';
    container.dataset.testid = `card-${card.id}`;
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.id = `card-${card.id}`;
    cardDiv.onclick = () => handleCardClick(card.id);
    
    // Front (Face Down)
    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.innerHTML = ICONS.sparkles.replace('class="card-icon"', 'class="card-icon" style="color: rgba(255,255,255,0.4);"');
    
    // Back (Face Up)
    const back = document.createElement('div');
    back.className = 'card-face card-back';
    back.innerHTML = ICONS[card.icon];
    
    cardDiv.appendChild(front);
    cardDiv.appendChild(back);
    container.appendChild(cardDiv);
    
    return container;
}

function handleCardClick(id) {
    if (isProcessing) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Flip Card
    flipCard(id, true);
    flippedCards.push(id);
    
    if (flippedCards.length === 2) {
        isProcessing = true;
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }
}

function flipCard(id, isFlipped) {
    const card = cards.find(c => c.id === id);
    card.isFlipped = isFlipped;
    
    const cardElement = document.getElementById(`card-${id}`);
    if (isFlipped) {
        cardElement.classList.add('flipped');
    } else {
        cardElement.classList.remove('flipped');
    }
}

function checkForMatch() {
    const [id1, id2] = flippedCards;
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);
    
    if (card1.icon === card2.icon) {
        // Match
        setTimeout(() => {
            card1.isMatched = true;
            card2.isMatched = true;
            
            document.getElementById(`card-${id1}`).classList.add('matched');
            document.getElementById(`card-${id2}`).classList.add('matched');
            
            flippedCards = [];
            isProcessing = false;
            checkWin();
        }, 500);
    } else {
        // No Match
        setTimeout(() => {
            flipCard(id1, false);
            flipCard(id2, false);
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

function checkWin() {
    if (cards.every(c => c.isMatched)) {
        gameWon = true;
        isActive = false;
        clearInterval(timerInterval);
        
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = formatTime(timer);
        winModal.classList.remove('hidden');
    }
}

function updateTimer() {
    if (isActive) {
        timer++;
        timerDisplay.textContent = formatTime(timer);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Start Game
init();
