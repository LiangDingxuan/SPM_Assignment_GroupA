// Toggle popup for difficulty setting
function togglePopup(popupid) {
  document.getElementById(popupid).classList.toggle("active");
}

function loadSavedGame() {
    const saveName = prompt("Enter the name of your saved game:");
    if (saveName) {
      const savedGameString = localStorage.getItem(`cityBuildingGame_${saveName}`);
      if (savedGameString) {
        const savedGame = JSON.parse(savedGameString);
        if (savedGame && savedGame.mode === "arcade") {
          window.location.href = `arcade.html?load=${saveName}`;
        } else if (savedGame && savedGame.mode === "freeplay") {
          window.location.href = `freeplay.html?load=${saveName}`;
        } else {
          alert("Invalid save file.");
        }
      } else {
        alert("Save file not found.");
      }
    }
  }
  

function displayHighScores() {
  // Placeholder for high scores display logic
  alert("High scores display functionality not implemented yet.");
}

function exitGame() {
  // Placeholder for exit game logic
  alert("Exit game functionality not implemented yet.");
}