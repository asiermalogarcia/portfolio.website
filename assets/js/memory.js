/* assets/js/memory.js
   Memory Flip Card game - dynamic board, 2 difficulties, start/restart, stats, win message
*/

// ---------- Data (at least 12 unique items so hard mode can use 12 pairs) ----------
const ICONS = [
  '🍎','🚀','⚽','🎧','🎲','🏝️','🐶','🌟','📚','🎯','🔑','🎵'
];

// ---------- DOM ----------
const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultySelect = document.getElementById('difficulty');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const winMessage = document.getElementById('winMessage');

// ---------- State ----------
let gridCols = 4;
let gridRows = 3;
let totalPairs = 6;
let deck = [];          // array of card objects {id, icon, matched}
let flipped = [];       // flipped card DOM elements (max 2)
let lock = false;       // lock board during check
let moves = 0;
let matches = 0;
let gameStarted = false;

// ---------- Utilities ----------
function shuffleArray(arr) {
  // Fisher-Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function setDifficultyFromUI() {
  const diff = difficultySelect.value;
  if (diff === 'easy') {
    gridCols = 4; gridRows = 3; totalPairs = 6;
    board.classList.remove('grid-6x4'); board.classList.add('grid-4x3');
  } else {
    gridCols = 6; gridRows = 4; totalPairs = 12;
    board.classList.remove('grid-4x3'); board.classList.add('grid-6x4');
  }
}

// ---------- Game init/reset ----------
function buildDeck() {
  // choose totalPairs unique icons from ICONS
  const iconsCopy = ICONS.slice();
  shuffleArray(iconsCopy);
  const selected = iconsCopy.slice(0, totalPairs);
  // duplicate each to make pairs, assign unique ids
  const pairItems = [];
  selected.forEach((icon, idx) => {
    pairItems.push({ id: idx + '-a', icon, matched: false });
    pairItems.push({ id: idx + '-b', icon, matched: false });
  });
  shuffleArray(pairItems);
  deck = pairItems;
}

function renderBoard() {
  // clear board
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
  // create card elements
  deck.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'card memory-card';
    card.dataset.id = cardData.id;
    card.dataset.icon = cardData.icon;

    const inner = document.createElement('div');
    inner.className = 'inner';

    const front = document.createElement('div');
    front.className = 'card-face front';
    front.textContent = '?';

    const back = document.createElement('div');
    back.className = 'card-face back';
    back.textContent = cardData.icon; // reveal icon on back

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // click handler
    card.addEventListener('click', () => onCardClick(card));
    board.appendChild(card);
  });
}

function resetStats() {
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
  winMessage.hidden = true;
}

// ---------- Interaction ----------
function onCardClick(card) {
  if (lock) return;
  if (!gameStarted) return; // only clickable after Start
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  // flip card
  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    lock = true;
    moves++;
    movesEl.textContent = moves;

    const [c1, c2] = flipped;
    const icon1 = c1.dataset.icon;
    const icon2 = c2.dataset.icon;

    if (icon1 === icon2) {
      // match
      setTimeout(() => {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matches++;
        matchesEl.textContent = matches;
        flipped = [];
        lock = false;
        checkWin();
      }, 350);
    } else {
      // not match - flip back after delay
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        flipped = [];
        lock = false;
      }, 900);
    }
  }
}

function checkWin() {
  if (matches === totalPairs) {
    winMessage.hidden = false;
    // small celebration (flash)
    winMessage.textContent = `🎉 You won in ${moves} moves! 🎉`;
  }
}

// ---------- Controls ----------
function startGame() {
  setDifficultyFromUI();
  buildDeck();
  renderBoard();
  resetStats();
  gameStarted = true;
}

function restartGame() {
  gameStarted = false;
  flipped = [];
  lock = false;
  startGame();
}

// ---------- Event listeners ----------
startBtn.addEventListener('click', () => {
  startGame();
});

restartBtn.addEventListener('click', () => {
  restartGame();
});

difficultySelect.addEventListener('change', () => {
  // reinitialize when difficulty changes
  if (gameStarted) {
    restartGame();
  } else {
    setDifficultyFromUI();
    // adjust board class for initial layout (empty board)
    if (difficultySelect.value === 'easy') {
      board.classList.remove('grid-6x4'); board.classList.add('grid-4x3');
    } else {
      board.classList.remove('grid-4x3'); board.classList.add('grid-6x4');
    }
  }
});

// initialize UI defaults
(function initDefaults() {
  // set initial difficulty classes and empty board grid
  setDifficultyFromUI();
  board.classList.add(gridCols === 4 ? 'grid-4x3' : 'grid-6x4');
  // empty board placeholder (optional)
  board.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-soft); text-align:center;">Press Start to begin</p>';
})();

