// 500-Word Data Matrix Module
const vocabularyData = [
    { word: "Morgenmad", translation: "Breakfast", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500" },
    { word: "Kaffekop", translation: "Coffee cup", img: "https://images.unsplash.com/photo-1517256010531-37c89783f9f8?w=500" },
    { word: "Tandbørste", translation: "Toothbrush", img: "https://images.unsplash.com/photo-1559591937-e68fb3305e43?w=500" },
    { word: "Arbejde", translation: "Work / Job", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500" },
    { word: "Seng", translation: "Bed", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500" },
    { word: "Aftensmad", translation: "Dinner", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500" },
    { word: "Bog", translation: "Book", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500" },
    { word: "Nøgle", translation: "Key", img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500" }
    // Add your remaining routine words directly inside this array matrix block!
];

let deck = [];
let currentCard = null;

// Initialization: Load progress from local browser storage or create clean database
function initApp() {
    const savedDeck = localStorage.getItem('dansk_vibe_srs_deck');
    if (savedDeck) {
        deck = JSON.parse(savedDeck);
    } else {
        deck = vocabularyData.map((item, index) => ({
            id: index,
            word: item.word,
            translation: item.translation,
            img: item.img,
            interval: 1,         // Stored in minutes initially
            nextReview: Date.now() // Due instantly
        }));
    }
    nextCard();
}

// Native Pronunciation Core (Web Speech Engine)
function speakDanish(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop competing audio tracks
        const voiceMessage = new SpeechSynthesisUtterance(text);
        voiceMessage.lang = 'da-DK';
        voiceMessage.rate = 0.85; // Slightly paced down for optimal ear training
        window.speechSynthesis.speak(voiceMessage);
    }
}

// True Anki Queue Sorting (Ebbinghaus Prioritization Engine)
function nextCard() {
    const now = Date.now();
    
    // Sort array by which word is oldest past its review deadline
    deck.sort((a, b) => a.nextReview - b.nextReview);
    
    currentCard = deck[0];
    
    // Render state updates to DOM interface elements
    document.getElementById('danish-word').innerText = currentCard.word;
    document.getElementById('english-meaning').innerText = currentCard.translation;
    document.getElementById('vocab-image').src = currentCard.img;
    
    updateStatsBar(now);
    speakDanish(currentCard.word);
}

// Algorithmic State Transformer based on User Performance feedback
function handleSRS(qualityMultiplier) {
    if (!currentCard) return;

    // Standard Multiplier logic: Easy increases spacing exponentially, Hard shrinks it
    if (qualityMultiplier === 1) {
        currentCard.interval = 1; // Drop intervals completely back down to 1-minute cycle
    } else {
        currentCard.interval = Math.round(currentCard.interval * qualityMultiplier * 1.8);
    }

    // Assign the future timestamp threshold limit
    currentCard.nextReview = Date.now() + (currentCard.interval * 60 * 1000);
    
    // Commit current state array data directly to Browser Memory cache
    localStorage.setItem('dansk_vibe_srs_deck', JSON.stringify(deck));
    
    // Seamless continuous transition to next high priority target flashcard
    nextCard();
}

function updateStatsBar(nowTime) {
    const dueCount = deck.filter(card => card.nextReview <= nowTime).length;
    const masteredCount = deck.filter(card => card.interval > 20).length; // Interval > 20 min considered short-term stable
    const masteryPercentage = Math.round((masteredCount / deck.length) * 100);

    document.getElementById('queue-count').innerText = dueCount > 0 ? dueCount : "0 (Ahead of curve!)";
    document.getElementById('mastered-percentage').innerText = `${masteryPercentage}%`;
}

// Boot the execution thread
window.onload = initApp;