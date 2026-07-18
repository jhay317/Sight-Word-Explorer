/* ==========================================================================
   SIGHT WORD EXPLORER - APPLICATION CORE
   ========================================================================== */

// 1. WORD DATASETS
const WORD_LISTS = {
  'kindergarten-easy': [
    'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for',
    'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little',
    'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said',
    'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'
  ],
  'kindergarten-hard': [
    'all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came',
    'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like',
    'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran',
    'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this',
    'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who', 'will',
    'with', 'yes'
  ],
  'fry-first-100': [
    'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it',
    'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I',
    'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'words',
    'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
    'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if',
    'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so',
    'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look',
    'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could', 'people',
    'my', 'than', 'first', 'water', 'been', 'called', 'who', 'am', 'its', 'now',
    'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'
  ]
};

// Available stickers database
const STICKER_DATABASE = [
  // Space stickers
  { id: 'rocket', emoji: '🚀', name: 'Spaceship', cost: 5, category: 'space' },
  { id: 'alien', emoji: '👽', name: 'Alien Friend', cost: 5, category: 'space' },
  { id: 'astronaut', emoji: '🧑‍🚀', name: 'Astronaut', cost: 5, category: 'space' },
  { id: 'planet', emoji: '🪐', name: 'Ring Planet', cost: 5, category: 'space' },
  { id: 'ufo', emoji: '🛸', name: 'Flying Saucer', cost: 5, category: 'space' },
  
  // Jungle stickers
  { id: 'monkey', emoji: '🐒', name: 'Climbing Monkey', cost: 5, category: 'jungle' },
  { id: 'banana', emoji: '🍌', name: 'Banana Bunch', cost: 5, category: 'jungle' },
  { id: 'parrot', emoji: '🦜', name: 'Colorful Parrot', cost: 5, category: 'jungle' },
  { id: 'palm', emoji: '🌴', name: 'Palm Tree', cost: 5, category: 'jungle' },
  { id: 'tiger', emoji: '🐅', name: 'Baby Tiger', cost: 5, category: 'jungle' },
  
  // Ocean stickers
  { id: 'fish', emoji: '🐠', name: 'Tropical Fish', cost: 5, category: 'ocean' },
  { id: 'octopus', emoji: '🐙', name: 'Friendly Octopus', cost: 5, category: 'ocean' },
  { id: 'shark', emoji: '🦈', name: 'Happy Shark', cost: 5, category: 'ocean' },
  { id: 'crab', emoji: '🦀', name: 'Tiny Crab', cost: 5, category: 'ocean' },
  { id: 'sub', emoji: '🤿', name: 'Diver Mask', cost: 5, category: 'ocean' }
];

// 2. STATE MANAGER
class GameState {
  constructor() {
    this.playerName = 'Explorer';
    this.stars = 0;
    this.audioEnabled = true;
    this.activeListKey = 'kindergarten-easy';
    this.voiceKidPitch = true;
    
    // Tracking word results: { "the": { correct: 3, incorrect: 0 } }
    this.wordStats = {};
    // Disabled words by parent: { "away": true }
    this.disabledWords = {};
    
    // Owned sticker IDs
    this.ownedStickers = ['rocket', 'palm', 'fish']; // starting stickers
    // Placed stickers in scenes: { "space": [ { id: 'rocket', x: 100, y: 150, scale: 1, rotate: 0 } ] }
    this.placedStickers = {
      space: [],
      jungle: [],
      ocean: []
    };
    
    this.load();
  }

  load() {
    const saved = localStorage.getItem('sight_word_explorer_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.playerName = parsed.playerName || 'Explorer';
        this.stars = typeof parsed.stars === 'number' ? parsed.stars : 0;
        this.audioEnabled = parsed.audioEnabled !== undefined ? parsed.audioEnabled : true;
        this.activeListKey = parsed.activeListKey || 'kindergarten-easy';
        this.voiceKidPitch = parsed.voiceKidPitch !== undefined ? parsed.voiceKidPitch : true;
        this.wordStats = parsed.wordStats || {};
        this.disabledWords = parsed.disabledWords || {};
        this.ownedStickers = parsed.ownedStickers || ['rocket', 'palm', 'fish'];
        this.placedStickers = parsed.placedStickers || { space: [], jungle: [], ocean: [] };
      } catch (e) {
        console.error("Error loading save state", e);
      }
    }
  }

  save() {
    localStorage.setItem('sight_word_explorer_state', JSON.stringify({
      playerName: this.playerName,
      stars: this.stars,
      audioEnabled: this.audioEnabled,
      activeListKey: this.activeListKey,
      voiceKidPitch: this.voiceKidPitch,
      wordStats: this.wordStats,
      disabledWords: this.disabledWords,
      ownedStickers: this.ownedStickers,
      placedStickers: this.placedStickers
    }));
  }

  recordAnswer(word, isCorrect) {
    if (!this.wordStats[word]) {
      this.wordStats[word] = { correct: 0, incorrect: 0 };
    }
    if (isCorrect) {
      this.wordStats[word].correct++;
    } else {
      this.wordStats[word].incorrect++;
    }
    this.save();
  }

  getWordStatus(word) {
    const stats = this.wordStats[word];
    if (!stats || (stats.correct === 0 && stats.incorrect === 0)) return 'new';
    if (stats.correct >= 3 && stats.incorrect === 0) return 'mastered';
    if (stats.correct >= 3 && stats.correct / (stats.correct + stats.incorrect) >= 0.75) return 'mastered';
    return 'learning';
  }

  reset() {
    localStorage.removeItem('sight_word_explorer_state');
    this.playerName = 'Explorer';
    this.stars = 0;
    this.audioEnabled = true;
    this.activeListKey = 'kindergarten-easy';
    this.voiceKidPitch = true;
    this.wordStats = {};
    this.disabledWords = {};
    this.ownedStickers = ['rocket', 'palm', 'fish'];
    this.placedStickers = { space: [], jungle: [], ocean: [] };
    this.save();
  }
}

const STATE = new GameState();

// 3. SOUND SYNTHESIS ENGINE (Web Audio API - 100% Offline)
class SoundSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playPop() {
    if (!STATE.audioEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playChime() {
    if (!STATE.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Double tone bell
    const playNote = (freq, delay, vol, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(523.25, 0, 0.25, 0.4); // C5
    playNote(659.25, 0.08, 0.25, 0.4); // E5
    playNote(783.99, 0.16, 0.25, 0.5); // G5
  }

  playError() {
    if (!STATE.audioEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playFanfare() {
    if (!STATE.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Quick ascending major arpeggio with square waves
    const playHorn = (freq, startTime, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playHorn(261.63, now, 0.25); // C4
    playHorn(329.63, now + 0.08, 0.25); // E4
    playHorn(392.00, now + 0.16, 0.25); // G4
    playHorn(523.25, now + 0.24, 0.5); // C5
  }
}

const SOUNDS = new SoundSynth();

// 4. SPEECH SYNTHESIS ENGINE (Offline TTS with customized kids settings)
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.genderOption = true; // High pitch toggle
    this.loadVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer English female or kid-like sounding voices if available
    this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha'))) || 
                 voices.find(v => v.lang.startsWith('en')) || 
                 voices[0];
  }

  speak(text, onEndCallback = null) {
    if (!STATE.audioEnabled || !this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }
    
    // Stop currently speaking
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    // Children standard setup: slower pacing, higher pitch
    utterance.rate = 0.82; 
    utterance.pitch = STATE.voiceKidPitch ? 1.35 : 1.0; 
    
    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  }
}

const SPEECH = new SpeechEngine();

// 5. APPLICATION FLOW & VIEW CONTROLLER
class AppController {
  constructor() {
    this.currentScreen = 'screen-welcome';
    
    // DOM Cache
    this.screens = document.querySelectorAll('.game-screen');
    
    this.starsCountLabel = document.getElementById('stars-count');
    this.playerNameLabel = document.getElementById('player-name-label');
    this.avatarDisplay = document.getElementById('avatar-display');
    this.soundBtn = document.getElementById('sound-btn');
    
    this.initGlobalEvents();
    this.updateStarsUI();
  }

  navigateTo(screenId) {
    // Stop speech synthesis if running
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    if (screenId !== 'screen-parent-gate') {
      this.prevScreen = this.currentScreen;
    }
    
    this.screens.forEach(s => {
      s.classList.remove('active');
    });
    
    const target = document.getElementById(screenId);
    if (target) {
      this.currentScreen = screenId;
      target.classList.add('active');
      
      // Perform screen specific setups
      this.onScreenActivated(screenId);
    }
  }

  onScreenActivated(screenId) {
    switch (screenId) {
      case 'screen-welcome':
        document.getElementById('player-name').value = STATE.playerName;
        break;
        
      case 'screen-dashboard':
        setupDashboard();
        break;
        
      case 'screen-assessment-init':
        document.getElementById('welcome-player-name').textContent = STATE.playerName;
        SPEECH.speak(`Hi ${STATE.playerName}! Let's do a quick fun challenge to see which words you already know! Click the big button when you are ready.`);
        break;
        
      case 'screen-assessment':
        startAssessmentFlow();
        break;
        
      case 'screen-game-selection':
        document.getElementById('hub-player-name').textContent = STATE.playerName;
        SPEECH.speak("Where do you want to go next? Bubble Pop, Safari Path, or make a sticker scene?");
        break;
        
      case 'screen-game-bubble-pop':
        startGameBubblePop();
        break;
        
      case 'screen-game-safari':
        startGameSafari();
        break;
        
      case 'screen-stickers':
        setupStickersScreen();
        break;
    }
  }

  updateStarsUI() {
    this.starsCountLabel.textContent = STATE.stars;
    this.playerNameLabel.textContent = STATE.playerName;
    // Set a cool emoji avatar based on stars!
    if (STATE.stars >= 50) this.avatarDisplay.textContent = '👑';
    else if (STATE.stars >= 30) this.avatarDisplay.textContent = '🚀';
    else if (STATE.stars >= 15) this.avatarDisplay.textContent = '🦁';
    else this.avatarDisplay.textContent = '⭐';
  }

  initGlobalEvents() {
    // Sound Button
    this.soundBtn.addEventListener('click', () => {
      STATE.audioEnabled = !STATE.audioEnabled;
      this.soundBtn.textContent = STATE.audioEnabled ? '🔊' : '🔇';
      STATE.save();
      
      // Flash Toast
      showToast(STATE.audioEnabled ? "Sound Enabled!" : "Sound Muted");
    });
    
    // Parent Gate Entrance
    document.getElementById('parent-lock-btn').addEventListener('click', () => {
      // Setup random equation
      const val1 = Math.floor(Math.random() * 5) + 3; // 3-7
      const val2 = Math.floor(Math.random() * 5) + 2; // 2-6
      const isAdd = Math.random() > 0.3;
      
      let answer, questionStr;
      if (isAdd) {
        answer = val1 + val2;
        questionStr = `${val1} + ${val2} = ?`;
      } else {
        answer = val1 + val2 - val2; // avoid negative
        questionStr = `${val1 + val2} - ${val2} = ?`;
        answer = val1;
      }
      
      const gateQ = document.getElementById('gate-question');
      gateQ.dataset.answer = answer;
      gateQ.textContent = questionStr;
      
      document.getElementById('gate-answer').value = '';
      document.getElementById('gate-error').classList.add('hide');
      this.navigateTo('screen-parent-gate');
    });

    // Parent Gate Cancel
    document.getElementById('gate-cancel').addEventListener('click', () => {
      this.navigateTo(this.prevScreen || 'screen-welcome');
    });
    
    // Parent Gate Submit
    document.getElementById('gate-submit').addEventListener('click', () => {
      const inputVal = parseInt(document.getElementById('gate-answer').value, 10);
      const correctAnswer = parseInt(document.getElementById('gate-question').dataset.answer, 10);
      
      if (inputVal === correctAnswer) {
        this.navigateTo('screen-dashboard');
      } else {
        SOUNDS.playError();
        const errorMsg = document.getElementById('gate-error');
        errorMsg.classList.remove('hide');
      }
    });

    // Dashboard Back
    document.getElementById('dashboard-back').addEventListener('click', () => {
      this.navigateTo('screen-welcome');
    });

    // Start Journey Welcome Screen
    document.getElementById('start-journey-btn').addEventListener('click', () => {
      const nameInp = document.getElementById('player-name').value.trim();
      STATE.playerName = nameInp || 'Guest';
      STATE.save();
      this.updateStarsUI();
      
      // Determine if they've ever completed an assessment or have any data
      const playedCount = Object.keys(STATE.wordStats).length;
      if (playedCount === 0) {
        this.navigateTo('screen-assessment-init');
      } else {
        this.navigateTo('screen-game-selection');
      }
    });

    // Start Assessment Challenge
    document.getElementById('start-assessment-btn').addEventListener('click', () => {
      this.navigateTo('screen-assessment');
    });

    // Hub Click Events
    document.getElementById('hub-goto-bubble-pop').addEventListener('click', () => {
      this.navigateTo('screen-game-bubble-pop');
    });
    document.getElementById('hub-goto-safari').addEventListener('click', () => {
      this.navigateTo('screen-game-safari');
    });
    document.getElementById('hub-goto-stickers').addEventListener('click', () => {
      this.navigateTo('screen-stickers');
    });
  }
}

let APP;
window.addEventListener('DOMContentLoaded', () => {
  APP = new AppController();
  
  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('Service Worker Registered!');
    }).catch(err => {
      console.warn('Service Worker registration failed', err);
    });
  }
});

// Toast Helper
function showToast(message) {
  const toast = document.getElementById('sound-toast');
  document.getElementById('toast-message').textContent = message;
  toast.classList.remove('hide');
  setTimeout(() => {
    toast.classList.add('hide');
  }, 2500);
}

// 6. ASSESSMENT PIPELINE FLOW
let currentAssessmentIndex = 0;
let assessmentQuestions = [];
let assessmentAnswers = []; // records boolean of correct choices

function startAssessmentFlow() {
  currentAssessmentIndex = 0;
  assessmentQuestions = [];
  assessmentAnswers = [];
  
  // Pick active word pool
  const wordPool = getActiveWordPool();
  if (wordPool.length < 5) {
    showToast("Warning: Word list too short!");
    APP.navigateTo('screen-game-selection');
    return;
  }
  
  // Shuffled copy of word pool, grab 10 words
  const shuffledPool = [...wordPool].sort(() => 0.5 - Math.random());
  const sampleCount = Math.min(10, shuffledPool.length);
  const targetWords = shuffledPool.slice(0, sampleCount);
  
  targetWords.forEach(word => {
    // Generate distractors
    const distractors = wordPool.filter(w => w !== word).sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [word, ...distractors].sort(() => 0.5 - Math.random());
    assessmentQuestions.push({
      target: word,
      options: options
    });
  });

  loadAssessmentQuestion();
}

function loadAssessmentQuestion() {
  if (currentAssessmentIndex >= assessmentQuestions.length) {
    finishAssessment();
    return;
  }

  const q = assessmentQuestions[currentAssessmentIndex];
  
  // Update Q counting label
  document.getElementById('assessment-q-count').textContent = `Word ${currentAssessmentIndex + 1} of ${assessmentQuestions.length}`;
  document.getElementById('assessment-progress-bar').style.width = `${(currentAssessmentIndex / assessmentQuestions.length) * 100}%`;
  
  // Render options
  const container = document.getElementById('assessment-options-container');
  container.innerHTML = '';
  
  q.options.forEach(word => {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word;
    card.addEventListener('click', () => handleAssessmentChoice(card, word, q.target));
    container.appendChild(card);
  });

  // Speak prompt
  setTimeout(() => {
    speakAssessmentWord();
  }, 300);

  // Setup repeat button
  const repeatBtn = document.getElementById('assessment-repeat-speech-btn');
  // Re-bind to clear old listeners
  const newBtn = repeatBtn.cloneNode(true);
  repeatBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', speakAssessmentWord);
}

function speakAssessmentWord() {
  const q = assessmentQuestions[currentAssessmentIndex];
  SPEECH.speak(`Find the word, ${q.target}`);
}

function handleAssessmentChoice(selectedCard, chosenWord, targetWord) {
  // Prevent double click on other cards
  const cards = document.querySelectorAll('#assessment-options-container .word-card');
  cards.forEach(c => c.style.pointerEvents = 'none');

  const isCorrect = (chosenWord === targetWord);
  assessmentAnswers.push(isCorrect);
  STATE.recordAnswer(targetWord, isCorrect);

  if (isCorrect) {
    selectedCard.classList.add('correct-feedback');
    SOUNDS.playChime();
  } else {
    selectedCard.classList.add('incorrect-feedback');
    // Also highlight correct answer softly
    cards.forEach(c => {
      if (c.textContent === targetWord) {
        c.classList.add('correct-feedback');
      }
    });
    SOUNDS.playError();
  }

  // Advance
  setTimeout(() => {
    currentAssessmentIndex++;
    loadAssessmentQuestion();
  }, 1600);
}

function finishAssessment() {
  const correctCount = assessmentAnswers.filter(a => a === true).length;
  document.getElementById('assessment-correct-count').textContent = correctCount;
  
  // Award 10 stars for assessment completion
  STATE.stars += 10;
  STATE.save();
  APP.updateStarsUI();

  APP.navigateTo('screen-assessment-results');
  
  // Confetti/Win Sound
  setTimeout(() => {
    SOUNDS.playFanfare();
    SPEECH.speak(`Amazing job, ${STATE.playerName}! You found ${correctCount} words. You earned 10 stars! Let's play a game!`);
  }, 500);

  // Handle results page button navigations
  document.getElementById('results-goto-games').onclick = () => {
    APP.navigateTo('screen-game-selection');
  };
  document.getElementById('results-goto-stickers').onclick = () => {
    APP.navigateTo('screen-stickers');
  };
}

// 7. PARENT DASHBOARD MANAGER
function setupDashboard() {
  // Accuracy
  let totalTrials = 0;
  let correctTrials = 0;
  Object.keys(STATE.wordStats).forEach(w => {
    const s = STATE.wordStats[w];
    totalTrials += (s.correct + s.incorrect);
    correctTrials += s.correct;
  });

  const accuracy = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0;
  document.getElementById('db-accuracy').textContent = `${accuracy}%`;

  // Count Mastery states
  let masteredCount = 0;
  let learningCount = 0;
  const wordPool = getActiveWordPool(true); // get entire active list ignoring parent checks to analyze status
  
  wordPool.forEach(w => {
    const status = STATE.getWordStatus(w);
    if (status === 'mastered') masteredCount++;
    else if (status === 'learning') learningCount++;
  });

  document.getElementById('db-words-mastered').textContent = masteredCount;
  document.getElementById('db-words-learning').textContent = learningCount;

  // Pie Chart Offset: 2 * PI * r = 251.2
  const strokeOffset = 251.2 - (251.2 * masteredCount / Math.max(1, wordPool.length));
  const slice = document.getElementById('chart-slice');
  slice.style.strokeDashoffset = strokeOffset;

  // Level selector
  const lvlSel = document.getElementById('word-list-selector');
  lvlSel.value = STATE.activeListKey;
  
  // Checkbox voice
  const kidPitchCheck = document.getElementById('voice-gender');
  kidPitchCheck.checked = STATE.voiceKidPitch;

  // Reset Listeners
  lvlSel.onchange = (e) => {
    STATE.activeListKey = e.target.value;
    STATE.save();
    setupDashboard(); // Redraw matrix
  };

  kidPitchCheck.onchange = (e) => {
    STATE.voiceKidPitch = e.target.checked;
    STATE.save();
  };

  // Export CSV
  document.getElementById('db-export-csv').onclick = () => {
    let csv = 'Word,Correct Count,Incorrect Count,Status\n';
    wordPool.forEach(w => {
      const s = STATE.wordStats[w] || { correct: 0, incorrect: 0 };
      const status = STATE.getWordStatus(w);
      csv += `"${w}",${s.correct},${s.incorrect},"${status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sight_word_progress_${STATE.playerName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Progress
  document.getElementById('db-reset-progress').onclick = () => {
    if (confirm("Are you sure you want to delete all stars, sticker scenes, and sight word statistics for this child? This cannot be undone.")) {
      STATE.reset();
      APP.updateStarsUI();
      APP.navigateTo('screen-welcome');
      showToast("Progress Reset successfully!");
    }
  };

  // Render Master List Grid
  const grid = document.getElementById('dashboard-words-grid');
  grid.innerHTML = '';
  
  wordPool.forEach(w => {
    const status = STATE.getWordStatus(w);
    const badge = document.createElement('div');
    badge.className = `word-badge ${status}`;
    if (STATE.disabledWords[w]) {
      badge.classList.add('inactive');
    }
    badge.textContent = w;
    badge.title = `Practice counts: ${STATE.wordStats[w]?.correct || 0} Correct, ${STATE.wordStats[w]?.incorrect || 0} Mistakes`;
    
    // Toggle word inclusion
    badge.onclick = () => {
      if (STATE.disabledWords[w]) {
        delete STATE.disabledWords[w];
      } else {
        STATE.disabledWords[w] = true;
      }
      STATE.save();
      badge.classList.toggle('inactive');
    };
    grid.appendChild(badge);
  });
}

// 8. BUBBLE POP GAME ENGINE
let bubbleGameActive = false;
let bubbleSpawnTimer = null;
let bubbleTargetWord = '';
let bubbleEarnedStars = 0;
let bubbleCorrectStreak = 0;
const BUBBLES_ON_SCREEN = [];

function startGameBubblePop() {
  bubbleGameActive = true;
  bubbleEarnedStars = 0;
  bubbleCorrectStreak = 0;
  document.getElementById('bubble-earned-stars').textContent = bubbleEarnedStars;
  
  const canvas = document.getElementById('bubble-canvas');
  // Clear any existing items
  canvas.querySelectorAll('.bubble').forEach(b => b.remove());
  BUBBLES_ON_SCREEN.length = 0;
  
  // Set first target word
  chooseNextBubbleTarget();

  // Back button
  document.getElementById('bubble-back-btn').onclick = () => {
    stopGameBubblePop();
    APP.navigateTo('screen-game-selection');
  };

  // Start spawn intervals
  if (bubbleSpawnTimer) clearInterval(bubbleSpawnTimer);
  bubbleSpawnTimer = setInterval(spawnBubble, 2200);
  
  // Spawn 3 starting bubbles immediately
  setTimeout(spawnBubble, 100);
  setTimeout(spawnBubble, 800);
  setTimeout(spawnBubble, 1500);

  // Setup loop
  requestAnimationFrame(updateBubblePhysics);
}

function chooseNextBubbleTarget() {
  const activePool = getActiveWordPool();
  if (activePool.length === 0) return;
  
  // Prefer words that are in "learning" mode or "new" mode
  const weightedList = [];
  activePool.forEach(w => {
    const status = STATE.getWordStatus(w);
    if (status === 'new') weightedList.push(w, w); // double weight
    else if (status === 'learning') weightedList.push(w, w, w); // triple weight
    else weightedList.push(w); // standard weight
  });

  const nextWord = weightedList[Math.floor(Math.random() * weightedList.length)];
  bubbleTargetWord = nextWord;
  document.getElementById('bubble-target-word').textContent = nextWord;
  
  speakBubbleTarget();

  const repBtn = document.getElementById('bubble-repeat-btn');
  const newBtn = repBtn.cloneNode(true);
  repBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', speakBubbleTarget);
}

function speakBubbleTarget() {
  if (bubbleTargetWord) {
    SPEECH.speak(`Pop the bubble: ${bubbleTargetWord}`);
  }
}

function spawnBubble() {
  if (!bubbleGameActive) return;
  
  const activePool = getActiveWordPool();
  if (activePool.length === 0) return;

  const canvas = document.getElementById('bubble-canvas');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  // 35% chance to spawn the target word, otherwise pick random
  let wordVal = '';
  if (Math.random() < 0.35) {
    wordVal = bubbleTargetWord;
  } else {
    wordVal = activePool[Math.floor(Math.random() * activePool.length)];
  }

  bubble.textContent = wordVal;
  
  // Bubble Dimension (75px to 105px)
  const size = Math.floor(Math.random() * 30) + 75;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.fontSize = `${Math.floor(size * 0.22)}px`;
  
  // Spawn horizontally inside container limits
  const canvasWidth = canvas.clientWidth || 800;
  const leftX = Math.random() * (canvasWidth - size - 40) + 20;
  bubble.style.left = `${leftX}px`;
  bubble.style.bottom = `-${size}px`;
  
  // Ascent Speed (randomized)
  const speed = Math.random() * 1.2 + 0.8;
  
  bubble.addEventListener('click', () => handleBubbleClick(bubble, wordVal, speed));
  
  canvas.appendChild(bubble);
  BUBBLES_ON_SCREEN.push({
    el: bubble,
    bottom: -size,
    size: size,
    speed: speed,
    word: wordVal
  });
}

function updateBubblePhysics() {
  if (!bubbleGameActive) return;

  for (let i = BUBBLES_ON_SCREEN.length - 1; i >= 0; i--) {
    const b = BUBBLES_ON_SCREEN[i];
    b.bottom += b.speed;
    b.el.style.bottom = `${b.bottom}px`;
    
    // Check top bound collision
    const canvasHeight = document.getElementById('bubble-canvas').clientHeight || 500;
    if (b.bottom > canvasHeight) {
      b.el.remove();
      BUBBLES_ON_SCREEN.splice(i, 1);
    }
  }

  requestAnimationFrame(updateBubblePhysics);
}

function handleBubbleClick(bubbleEl, wordVal, speed) {
  SOUNDS.playPop();
  
  const isCorrect = (wordVal === bubbleTargetWord);
  STATE.recordAnswer(bubbleTargetWord, isCorrect);
  
  // Pop Visual triggers
  bubbleEl.classList.add('popped');
  setTimeout(() => bubbleEl.remove(), 200);

  // Remove from tracking array
  const trackIdx = BUBBLES_ON_SCREEN.findIndex(b => b.el === bubbleEl);
  if (trackIdx !== -1) {
    BUBBLES_ON_SCREEN.splice(trackIdx, 1);
  }

  if (isCorrect) {
    bubbleEarnedStars++;
    bubbleCorrectStreak++;
    document.getElementById('bubble-earned-stars').textContent = bubbleEarnedStars;
    
    // Add real global stars
    STATE.stars++;
    STATE.save();
    APP.updateStarsUI();
    
    // Play celebratory sound if hit streak
    if (bubbleCorrectStreak % 3 === 0) {
      SOUNDS.playChime();
      showToast(`${bubbleCorrectStreak} Correct Words in a row! ⭐`);
    }

    // Change Target Word immediately
    chooseNextBubbleTarget();
  } else {
    // Punish streak
    bubbleCorrectStreak = 0;
    SOUNDS.playError();
    
    // Spawn secondary target bubble to help them find it
    setTimeout(() => {
      // Prompt repeat guidance
      speakBubbleTarget();
    }, 500);
  }
}

function stopGameBubblePop() {
  bubbleGameActive = false;
  if (bubbleSpawnTimer) {
    clearInterval(bubbleSpawnTimer);
    bubbleSpawnTimer = null;
  }
  BUBBLES_ON_SCREEN.forEach(b => b.el.remove());
  BUBBLES_ON_SCREEN.length = 0;
}

// 9. SAFARI PATH GAME ENGINE
let safariTargetWord = '';
let safariLevelIndex = 0; // max 4 path rounds
let safariEarnedStars = 0;

function startGameSafari() {
  safariLevelIndex = 0;
  safariEarnedStars = 0;
  document.getElementById('safari-earned-stars').textContent = safariEarnedStars;

  // Move character to beginning
  const char = document.getElementById('safari-character');
  char.style.left = '5%';
  char.style.bottom = '12%';
  char.classList.remove('jumping');

  // Back button
  document.getElementById('safari-back-btn').onclick = () => {
    APP.navigateTo('screen-game-selection');
  };

  // Close treasure chest
  const chest = document.getElementById('safari-treasure');
  chest.className = 'treasure-chest';
  chest.textContent = '🎁';
  chest.onclick = null;

  generateSafariRound();
}

function generateSafariRound() {
  const activePool = getActiveWordPool();
  if (activePool.length < 3) return;

  const stonesRow = document.getElementById('safari-stones-row');
  stonesRow.innerHTML = '';

  // Select target word
  const targetWord = activePool[Math.floor(Math.random() * activePool.length)];
  safariTargetWord = targetWord;
  document.getElementById('safari-target-word').textContent = targetWord;

  // Pick distractor words
  const distractors = activePool.filter(w => w !== targetWord).sort(() => 0.5 - Math.random()).slice(0, 2);
  const words = [targetWord, ...distractors].sort(() => 0.5 - Math.random());

  // Generate 3 stones side-by-side inside this round path
  words.forEach((word) => {
    const col = document.createElement('div');
    col.className = 'stone-column';

    const stone = document.createElement('button');
    stone.className = 'stone-btn';
    stone.textContent = word;
    stone.addEventListener('click', () => handleSafariStoneChoice(stone, word));
    
    col.appendChild(stone);
    stonesRow.appendChild(col);
  });

  setTimeout(() => {
    speakSafariTarget();
  }, 400);

  // Repeat button
  const repBtn = document.getElementById('safari-repeat-btn');
  const newBtn = repBtn.cloneNode(true);
  repBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', speakSafariTarget);
}

function speakSafariTarget() {
  SPEECH.speak(`Help Leo jump on: ${safariTargetWord}`);
}

function handleSafariStoneChoice(stoneEl, wordVal) {
  const stones = document.querySelectorAll('.stone-btn');
  const isCorrect = (wordVal === safariTargetWord);
  
  STATE.recordAnswer(safariTargetWord, isCorrect);

  if (isCorrect) {
    // Disable interactions
    stones.forEach(s => s.style.pointerEvents = 'none');
    stoneEl.classList.add('correct');
    
    // Jump character to correct stone
    const char = document.getElementById('safari-character');
    char.classList.add('jumping');
    
    // Calculate position
    const rect = stoneEl.getBoundingClientRect();
    const parentRect = document.getElementById('safari-canvas').getBoundingClientRect();
    const targetLeft = rect.left - parentRect.left + (rect.width/2) - 40;
    
    setTimeout(() => {
      char.style.left = `${targetLeft}px`;
      char.style.bottom = '42%'; // Jump onto stone row
    }, 100);

    SOUNDS.playChime();
    
    setTimeout(() => {
      char.classList.remove('jumping');
      safariLevelIndex++;
      safariEarnedStars += 2;
      document.getElementById('safari-earned-stars').textContent = safariEarnedStars;
      
      STATE.stars += 2;
      STATE.save();
      APP.updateStarsUI();

      if (safariLevelIndex >= 4) {
        // Complete Safari - jump to treasure chest!
        finishSafariGame();
      } else {
        // Reset lion slightly and launch next round
        setTimeout(() => {
          char.style.left = '5%';
          char.style.bottom = '12%';
          generateSafariRound();
        }, 800);
      }
    }, 600);

  } else {
    // Incorrect choice
    stoneEl.classList.add('incorrect');
    SOUNDS.playError();
    
    // Re-prompt instructions
    setTimeout(() => {
      speakSafariTarget();
    }, 500);
  }
}

function finishSafariGame() {
  const char = document.getElementById('safari-character');
  const chest = document.getElementById('safari-treasure');
  
  // Jump to chest
  char.classList.add('jumping');
  char.style.left = '82%';
  char.style.bottom = '40%';
  
  // Empty stones
  document.getElementById('safari-stones-row').innerHTML = '<div class="canvas-instructions">You reached the end! Open the treasure box!</div>';

  setTimeout(() => {
    char.classList.remove('jumping');
    SOUNDS.playFanfare();
    SPEECH.speak("Hooray! You crossed the river! Click the box to open your prize!");
    
    // Active treasure chest click
    chest.onclick = () => {
      chest.textContent = '🔓✨';
      chest.classList.add('open');
      
      // Award big stars payout (+10 additional bonus stars)
      STATE.stars += 10;
      safariEarnedStars += 10;
      document.getElementById('safari-earned-stars').textContent = safariEarnedStars;
      STATE.save();
      APP.updateStarsUI();
      
      SOUNDS.playChime();
      showToast("+10 Bonus Stars Chest! 🌟");
      chest.onclick = null;
      
      SPEECH.speak("Incredible job! Go play again or custom create in the Sticker Scene!");
      
      // Route back after a short delay
      setTimeout(() => {
        APP.navigateTo('screen-game-selection');
      }, 3500);
    };
  }, 600);
}


// 10. STICKER SCENE CREATOR PIPELINE
let activeScene = 'space';
let selectedStickerElement = null;

function setupStickersScreen() {
  // Setup Back navigation
  document.getElementById('stickers-back-btn').onclick = () => {
    APP.navigateTo('screen-game-selection');
  };

  // Scene Selector drop change
  const sceneSel = document.getElementById('scene-selector');
  sceneSel.value = activeScene;
  updateStickersWorkspaceBackground();
  
  sceneSel.onchange = (e) => {
    activeScene = e.target.value;
    updateStickersWorkspaceBackground();
    loadPlacedStickers();
  };

  // Clear scene
  document.getElementById('clear-scene-btn').onclick = () => {
    if (confirm("Do you want to clear all stickers from this scene?")) {
      STATE.placedStickers[activeScene] = [];
      STATE.save();
      loadPlacedStickers();
    }
  };

  // Tab Setup
  const tabBuy = document.getElementById('tab-buy');
  const tabMy = document.getElementById('tab-my');
  const shelfBuy = document.getElementById('shelf-buy-stickers');
  const shelfMy = document.getElementById('shelf-my-stickers');

  tabBuy.onclick = () => {
    tabBuy.classList.add('active');
    tabMy.classList.remove('active');
    shelfBuy.classList.add('active');
    shelfMy.classList.remove('active');
  };

  tabMy.onclick = () => {
    tabMy.classList.add('active');
    tabBuy.classList.remove('active');
    shelfMy.classList.add('active');
    shelfBuy.classList.remove('active');
  };

  // Load inventory
  renderStickerShopShelf();
  renderStickerOwnedShelf();
  loadPlacedStickers();

  // Click canvas background deselects active sticker
  document.getElementById('stickers-canvas').addEventListener('pointerdown', (e) => {
    if (e.target.id === 'stickers-canvas' || e.target.id === 'canvas-empty-hint') {
      deselectSticker();
    }
  });
}

function updateStickersWorkspaceBackground() {
  const canvas = document.getElementById('stickers-canvas');
  canvas.className = `stickers-canvas ${activeScene}`;
}

function renderStickerShopShelf() {
  const shelf = document.getElementById('shelf-buy-stickers');
  shelf.innerHTML = '';

  STICKER_DATABASE.forEach(sticker => {
    const isOwned = STATE.ownedStickers.includes(sticker.id);
    const item = document.createElement('div');
    item.className = 'sticker-item';
    
    if (isOwned) {
      item.classList.add('disabled');
    }

    item.innerHTML = `
      <div class="sticker-item-icon">${sticker.emoji}</div>
      <div class="sticker-cost">${isOwned ? 'Owned' : `${sticker.cost} ⭐`}</div>
    `;

    if (!isOwned) {
      item.addEventListener('click', () => buySticker(sticker));
    }
    
    shelf.appendChild(item);
  });
}

function renderStickerOwnedShelf() {
  const shelf = document.getElementById('shelf-my-stickers');
  shelf.innerHTML = '';

  // Get owned stickers list
  const ownedList = STICKER_DATABASE.filter(s => STATE.ownedStickers.includes(s.id));
  
  if (ownedList.length === 0) {
    shelf.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 20px;">Buy some stickers with your stars!</div>';
    return;
  }

  ownedList.forEach(sticker => {
    const item = document.createElement('div');
    item.className = 'sticker-item';
    item.innerHTML = `
      <div class="sticker-item-icon">${sticker.emoji}</div>
      <div class="sticker-owned-label">Drag Me</div>
    `;

    // Implement double-tap/click to drop on scene, or dragging
    item.addEventListener('click', () => {
      // Spawn directly in the center of the canvas
      addStickerToCanvas(sticker.id, 100, 100, 1.0, 0);
    });

    shelf.appendChild(item);
  });
}

function buySticker(sticker) {
  if (STATE.stars >= sticker.cost) {
    STATE.stars -= sticker.cost;
    STATE.ownedStickers.push(sticker.id);
    STATE.save();
    APP.updateStarsUI();
    SOUNDS.playChime();
    showToast(`Unlocked ${sticker.name}! 🎨`);
    
    // Refresh
    renderStickerShopShelf();
    renderStickerOwnedShelf();
  } else {
    SOUNDS.playError();
    showToast("Need more stars! Play games to earn stars! ⭐");
  }
}

function addStickerToCanvas(stickerId, x, y, scale = 1, rotate = 0) {
  const sticker = STICKER_DATABASE.find(s => s.id === stickerId);
  if (!sticker) return;

  const canvas = document.getElementById('stickers-canvas');
  
  // Hide empty text hint
  const hint = document.getElementById('canvas-empty-hint');
  if (hint) hint.classList.add('hide');

  const el = document.createElement('div');
  el.className = 'canvas-sticker';
  el.dataset.stickerId = stickerId;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.innerHTML = `<span style="font-size: 55px;">${sticker.emoji}</span>`;
  
  // Transform scale/rotation properties
  el.dataset.scale = scale;
  el.dataset.rotate = rotate;
  applyStickerTransform(el);

  canvas.appendChild(el);
  
  // Save placement immediately
  saveStickersCoords();

  // Make interactive
  initStickerInteractions(el);
  
  // Select it
  selectSticker(el);
}

function applyStickerTransform(el) {
  const scale = el.dataset.scale || 1;
  const rotate = el.dataset.rotate || 0;
  el.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
}

function selectSticker(el) {
  deselectSticker();
  
  selectedStickerElement = el;
  el.classList.add('selected');

  // Append control indicators (Delete & Rotate)
  const delBtn = document.createElement('div');
  delBtn.className = 'sticker-control sticker-delete-btn';
  delBtn.textContent = '❌';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    el.remove();
    selectedStickerElement = null;
    saveStickersCoords();
    
    // Check if canvas empty
    const canvas = document.getElementById('stickers-canvas');
    if (canvas.querySelectorAll('.canvas-sticker').length === 0) {
      document.getElementById('canvas-empty-hint').classList.remove('hide');
    }
  });

  const rotBtn = document.createElement('div');
  rotBtn.className = 'sticker-control sticker-rotate-btn';
  rotBtn.textContent = '🔄';
  
  // Click cycles rotation
  rotBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let r = parseInt(el.dataset.rotate || 0, 10) + 45;
    if (r >= 360) r = 0;
    el.dataset.rotate = r;
    applyStickerTransform(el);
    saveStickersCoords();
  });

  el.appendChild(delBtn);
  el.appendChild(rotBtn);
}

function deselectSticker() {
  if (selectedStickerElement) {
    selectedStickerElement.classList.remove('selected');
    selectedStickerElement.querySelectorAll('.sticker-control').forEach(ctrl => ctrl.remove());
    selectedStickerElement = null;
  }
}

function initStickerInteractions(el) {
  let isDragging = false;
  let startX = 0, startY = 0;
  let elemX = 0, elemY = 0;

  el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    selectSticker(el);
    
    isDragging = true;
    el.style.zIndex = '100';
    
    const parentRect = document.getElementById('stickers-canvas').getBoundingClientRect();
    
    startX = e.clientX;
    startY = e.clientY;
    
    elemX = el.offsetLeft;
    elemY = el.offsetTop;
    
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    const canvas = document.getElementById('stickers-canvas');
    const maxX = canvas.clientWidth - el.offsetWidth;
    const maxY = canvas.clientHeight - el.offsetHeight;
    
    let nextX = elemX + dx;
    let nextY = elemY + dy;
    
    // Bound clamps
    nextX = Math.max(0, Math.min(nextX, maxX));
    nextY = Math.max(0, Math.min(nextY, maxY));
    
    el.style.left = `${nextX}px`;
    el.style.top = `${nextY}px`;
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      el.style.zIndex = '10';
      el.releasePointerCapture(e.pointerId);
      saveStickersCoords();
    }
  };

  el.addEventListener('pointerup', stopDrag);
  el.addEventListener('pointercancel', stopDrag);
}

function saveStickersCoords() {
  const canvas = document.getElementById('stickers-canvas');
  const stickers = canvas.querySelectorAll('.canvas-sticker');
  const savedList = [];
  
  stickers.forEach(s => {
    savedList.push({
      id: s.dataset.stickerId,
      x: s.offsetLeft,
      y: s.offsetTop,
      scale: s.dataset.scale || 1,
      rotate: s.dataset.rotate || 0
    });
  });

  STATE.placedStickers[activeScene] = savedList;
  STATE.save();
}

function loadPlacedStickers() {
  const canvas = document.getElementById('stickers-canvas');
  // Clear currently loaded stickers
  canvas.querySelectorAll('.canvas-sticker').forEach(s => s.remove());

  const savedList = STATE.placedStickers[activeScene] || [];
  const hint = document.getElementById('canvas-empty-hint');
  
  if (savedList.length === 0) {
    if (hint) hint.classList.remove('hide');
    return;
  }

  if (hint) hint.classList.add('hide');

  savedList.forEach(stickerData => {
    addStickerToCanvas(stickerData.id, stickerData.x, stickerData.y, stickerData.scale, stickerData.rotate);
  });
  
  // De-select immediately after loader
  deselectSticker();
}


// 11. GENERAL UTILITIES
function getActiveWordPool(includeDisabled = false) {
  const key = STATE.activeListKey;
  const list = WORD_LISTS[key] || WORD_LISTS['kindergarten-easy'];
  if (includeDisabled) return list;
  // Exclude words that are blocked by parent
  return list.filter(w => !STATE.disabledWords[w]);
}
