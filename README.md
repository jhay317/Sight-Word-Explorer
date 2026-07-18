# 🚀 Sight Word Explorer

An engaging, premium, and interactive offline-first sight word learning game and assessment tool designed specifically for children aged 5–7. It features interactive learning mini-games, an adaptive initial discovery assessment, a creative rewards system, and a parent/teacher monitoring dashboard. 

The application is optimized to run smoothly on low-resource environments such as **ChromeOS Flex**, Chromebooks, and tablets.

---

## ✨ Features

### 🎮 Kid-Friendly Learning Games
*   **Bubble Pop 🫧**: Floating bubbles rise from the bottom of the screen. Children listen to the target sight word and pop the correct bubble to earn stars.
*   **Safari Path 🦁**: Help *Leo the Lion* cross a river by stepping on the correct sight word stepping stones.
*   **Interactive Sound Effects**: Implements retro 8-bit sound effects (pops, chimes, and buzzes) generated entirely offline.

### 🎨 Sticker Scene Creator (Reward System)
*   Children earn stars by answering questions correctly.
*   Stars can be spent in the **Sticker Shop** to unlock cute, kid-friendly stickers (Space, Jungle, and Ocean categories).
*   Unlocked stickers can be dragged, dropped, scaled, and rotated onto customizable themed scenes (🌌 Cosmic Space, 🌳 Deep Jungle, 🐠 Blue Ocean).

### 📝 Adaptive Initial Discovery Assessment
*   Starts with an initial assessment challenge to gauge the child's starting point.
*   Determines which words the explorer already knows and updates their learning path accordingly.

### 📊 Parent & Teacher Dashboard
Securely locked behind a mathematical gateway to prevent accidental modification by kids, the dashboard provides:
*   **Vocabulary Selection**: Switch active lists between:
    *   *Kindergarten Standard* (Dolch Pre-Primer)
    *   *Kindergarten Advanced* (Dolch Primer)
    *   *First Grade* (Dolch 1st Grade)
    *   *Second Grade* (Dolch 2nd Grade)
    *   *Third Grade* (Dolch 3rd Grade)
    *   *Nouns* (Dolch Nouns)
    *   *Fry First 100 Words*
    *   *Fry Second 100 Words*
    *   *Fry Third 100 Words*
*   **Gameplay Difficulty Selection**: Toggle between Easy, Medium, and Hard difficulty levels to scale target challenges for children:
    *   *Easy*: Slower audio speech rate (0.82), 3 card options in assessment discovery, slow bubble pop floating speed/spawn interval, and 3 stepping stones in Safari Path.
    *   *Medium*: Faster audio speech rate (0.92), 4 card options in assessment discovery, medium bubble speed/spawn interval, and 4 stepping stones in Safari Path.
    *   *Hard*: Standard audio speech rate (1.02), 5 card options in assessment discovery, rapid bubble speed/spawn interval, and 5 stepping stones in Safari Path.
*   **Word Rotation Matrix**: View mastered, learning, and un-encountered words. Parents and teachers can toggle individual words to manually enable or disable them in the active rotation.
*   **Visual Statistics**: Real-time accuracy metrics and mastered/learning counts depicted with a clean, dynamic SVG donut chart.
*   **Speech Customization**: Toggle voice pitch to synthesize a kid-friendly speech tone.
*   **Data Export**: Click to export student performance logs to a `.csv` file.
*   **Reset Progress**: Clear stats to restart the learning path.

---

## 🛠️ Technical Stack & Architecture

Sight Word Explorer is built with a lightweight, modern, and dependency-free stack to ensure high performance and offline durability:

*   **HTML5**: Semantic UI layout with structured single-page architecture.
*   **CSS3**: 
    *   Custom theme using CSS variables (`--color-primary`, `--sky-grad`, etc.).
    *   Smooth transitions and fluid animations (`pulse`, `bounce`, `float`, and ocean wave motions).
    *   Draggable sticker styles, grid layouts, and fully responsive media queries.
*   **Vanilla JavaScript (ES6)**:
    *   **State Management**: Simple `GameState` class managing state, handling JSON serialization, and saving to `localStorage`.
    *   **SoundSynth Engine**: Implements the **Web Audio API** to generate sound effects procedurally. This guarantees sound effects work 100% offline without downloading audio files.
    *   **Speech Engine**: Utilizes the **Web Speech API** (`window.speechSynthesis`) to pronounce words aloud, adjusting pitch settings for child-friendly audio.
    *   **Drag-and-Drop Handler**: Multi-touch and mouse event handlers that support drag, drop, multi-touch gesture scale, and rotate functionality for stickers.
*   **Service Worker (`sw.js`)**: A service worker that caches files (`index.html`, `styles.css`, `app.js`, `manifest.json`, `logo.png`) locally for a 100% offline-first PWA experience.

---

## 📂 Project Structure

```
Sight Word Game/
├── index.html        # Main SPA UI structure & screen definitions
├── styles.css        # Interactive design system, styling, animations
├── app.js            # Core application state, games, audio, and dashboard logic
├── sw.js             # Offline service worker caching assets
├── manifest.json     # PWA manifest metadata
├── logo.png          # App icon / launcher artwork
├── .gitignore        # Git exclusion list
└── README.md         # Documentation (this file)
```

---

## 🚀 Getting Started

### Local Development / Running
Since the application relies on an offline-first Service Worker, opening the `index.html` file directly via the `file://` protocol may cause some browsers to block Service Worker registration or Web Speech API features due to CORS restrictions.

To run the game locally, it is recommended to serve it using a lightweight local web server.

#### Option 1: VS Code Live Server
1. Install the **Live Server** extension in VS Code.
2. Click **Go Live** in the bottom right corner of your VS Code status bar.

#### Option 2: Python (Pre-installed on most systems)
Open your terminal inside the project directory and run:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

#### Option 3: Node.js (npx)
Run the following command:
```bash
npx serve .
```
Then navigate to the URL shown in the console.

---

## ⚙️ PWA Installation
To install the game as a desktop or mobile application:
1. Open the app in a modern browser (Google Chrome, Microsoft Edge, Safari).
2. Click the **Install Icon** in the URL search bar, or select **Add to Home Screen** from the browser menu.
3. Once installed, it can be launched directly from your desktop/apps menu and will run offline.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
